const process = require('process');
const fs      = require('fs');
const axios   = require('axios');
const fetch   = require('node-fetch');
const chalk   = require('chalk');


module.exports = {

  async onPreBuild({ inputs, utils }) {

    const endpoint = 'https://graph.instagram.com';
    const userId = process.env.INSTAGRAM_USER_ID;
    const fields = 'caption,media_url,media_type,permalink';
    const token = process.env.INSTAGRAM_ACCESS_TOKEN;
    const instagramAPIUrl = `${endpoint}/${userId}/media/?fields=${fields}&access_token=${token}`;

    console.log('token:', chalk.yellow(token));
    console.log('Constructed Instagram API url:', chalk.yellow(instagramAPIUrl));

    // Where fetched data should reside in the build
    const dataFile = inputs.dataFile;
    console.log('Instagram datafile location:', chalk.yellow(dataFile));

    // reinstate from cache if it is present
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
        const { data } = await axios.get(instagramAPIUrl)
        console.log('Data returned from Instagram API:'), chalk.yellow(data);
      } catch (error) {
        const { data, headers, status, statusText } = error.response
      }


      /*const data = await fetch(instagramAPIUrl)
        .then(res => {
          // ensure that we are only acting on JSON responses
          if(res.headers.get('content-type').includes('application/json')){
            console.log('Data returned from Instagram API:'), check.yellow(res);
            return res.json();
          } else {
            return null;
          }
        });
      */

      console.log('Data:'), check.yellow(data);

      // If we didn't receive JSON, fail the plugin but not the build
      if(!data){
        utils.build.failPlugin(`The Instagram feed did not return JSON data.\nProceeding with the build without the data from the plugin.`);
        return;
      }

      instagramData = [];
      for (const image of data.data) {
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
      console.log("Instagram data fetched from", chalk.yellow(instagramAPIUrl), "and cached", chalk.gray(`(TTL:${inputs.feedTTL} seconds)`));
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
        await fetch(sourceImageURL)
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