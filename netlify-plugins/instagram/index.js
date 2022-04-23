const process = require('process');
const fs      = require('fs');
const axios   = require('axios');
const chalk   = require('chalk');


module.exports = {

  async onPreBuild({ inputs, utils }) {

    const endpoint = 'https://graph.instagram.com';
    const userId = process.env.INSTAGRAM_USER_ID;
    const fields = 'caption,media_url,media_type,permalink';
    const token = process.env.INSTAGRAM_ACCESS_TOKEN;
    const instagramAPIUrl = `${endpoint}/${userId}/media/?fields=${fields}&access_token=${token}`;
    console.log('Constructed Instagram API url:', instagramAPIUrl);

    // Where fetched data should reside in the build
    const dataFile = inputs.dataFile;
    console.log('Instagram datafile location:', dataFile);

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
        console.log('Intagram Status:', chalk.green(response.status));
        instagramResponse = response.data;
      } catch (err) {
        console.log('Intagram Status:', chalk.red(err.status));
        console.error(err)
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
      console.log(chalk.yellow("Instagram data fetched from and cached"), chalk.gray(`(TTL:${inputs.feedTTL} seconds)`));
      console.log(JSON.stringify(instagramData);
    }

    // Now we have a well-formated data object describing the instagram feed,
    // let's fetch any uncached images we might need
    for (const image in instagramData) {
      let { localImageURL, sourceImageURL } = instagramData[image];
      // if the image exists in the cache, recover it.
      if ( await utils.cache.has(localImageURL) ) {
        await utils.cache.restore(localImageURL);
        console.log('Restored from cache:', chalk.green(localImageURL));
      } else {
        // if the image is not cached, fetch and cache it.
        await axios.get(sourceImageURL)
          .then(async res => {
              const dest = fs.createWriteStream(localImageURL);
              res.body.pipe(dest);
              await utils.cache.save(localImageURL, { ttl: inputs.imageTTL });
              console.log("Image cached:", chalk.yellow(localImageURL), chalk.gray(`(TTL:${inputs.imageTTL} seconds)`));
          });
      }
    }

  }
}