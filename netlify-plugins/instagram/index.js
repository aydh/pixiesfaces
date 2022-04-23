const process = require('process');
const fs      = require('fs');
const axios   = require('axios');
const chalk   = require('chalk');


module.exports = {

  async onPreBuild({ inputs, utils }) {
    console.log('Starting up');

    const endpoint = 'https://graph.instagram.com';
    const userId = process.env.INSTAGRAM_USER_ID;
    const fields = 'caption,media_url,media_type,permalink';
    const token = process.env.INSTAGRAM_ACCESS_TOKEN;
    const instagramAPIUrl = `${endpoint}/${userId}/media/?fields=${fields}&access_token=${token}`;
    console.log('Constructed Instagram API url:',  chalk.yellow(instagramAPIUrl));

    // Where fetched data should reside in the build
    const dataFile = inputs.dataFile;
    console.log('Instagram datafile location:', chalk.yellow(dataFile));

    // reinstate from cache if it is present
    let instagramResponse;
    let instagramData;
    if ( await utils.cache.has(dataFile) ) {
      await utils.cache.restore(dataFile);
      instagramData = require(`${process.cwd()}/${dataFile}`);
      console.log('Restored from cache:', chalk.green(dataFile));
    }
    // Or if it's not cached, let's fetch it and cache it.
    else {
      console.log('Instagram datafile not present so calling Instagram API');

      try {
        const response = await axios.get(instagramAPIUrl)
        console.log('Intagram Success - Return Status:', chalk.green(response.status));
        instagramResponse = response.data;
      } catch (err) {
        console.log('Intagram Failure - Return Status:', chalk.red(err.status));
        console.log(err)
      }

      // If we didn't receive data, fail the plugin but not the build
      if(!instagramResponse){
        utils.build.failPlugin(`The Instagram feed did not return data.\nProceeding with the build without the data from the plugin.`);
        return;
      }

      instagramData = [];
      for (const image of instagramResponse.data) {
        let localImageURL = `${inputs.imageFolder}/${image.id}.jpg`;
        instagramData.push({
          "id": image.id,
          "caption": image.caption,
          "instagramURL": image.permalink,
          "sourceImageURL": image.media_url,
          "localImageURL": localImageURL
        })
      }
      await fs.writeFileSync(dataFile, JSON.stringify(instagramData));
      await utils.cache.save(dataFile, { ttl: inputs.feedTTL });
      console.log(chalk.green("Instagram data fetched and cached"), chalk.gray(`(TTL:${inputs.feedTTL} seconds)`));
    }

    // Now we have a well-formated data object describing the instagram feed,
    // let's fetch any uncached images we might need
    console.log("Iterating over images");
    for (const image in instagramData) {
      let { localImageURL, sourceImageURL } = instagramData[image];
      console.log("Local image location:", chalk.yellow(localImageURL));
      // if the image exists in the cache, recover it.
      if ( await utils.cache.has(localImageURL) ) {
        console.log('Restoring from cache:', chalk.yellow(localImageURL));
        await utils.cache.restore(localImageURL);
        console.log('Restored from cache:', chalk.green(localImageURL));
      } else {
        // if the image is not cached, fetch and cache it.
        console.log("Retrieving from instagram URL:", chalk.grey(sourceImageURL));
        try {
          const response = await axios({
            url: sourceImageURL,
            method: 'GET',
            responseType: 'stream'      
          })
          console.log('Image Retrieval Success - Return Status:', chalk.green(response.status));
          const dest = fs.createWriteStream(localImageURL);
          response.data.pipe(dest);
          console.log("Image written out:", chalk.yellow(localImageURL));
          await utils.cache.save(localImageURL, { ttl: inputs.imageTTL });
          console.log("Image cached:", chalk.green(localImageURL), chalk.gray(`(TTL:${inputs.imageTTL} seconds)`));
        } catch (err) {
          console.log('Intagram Failure - Return Status:', chalk.red(err.status));
          console.log(err)
        }
      }
    }
  }
}