const process   = require('process');
const axios     = require('axios');
const fs        = require('fs');
const chalk     = require('chalk');
const sharp     = require('sharp');

module.exports = {

  async onPreBuild({ inputs, utils }) {
    
    console.log(chalk.cyanBright("================================"));
    console.log(chalk.cyanBright("= Instagram images starting up ="));
    console.log(chalk.cyanBright("================================"));

    const timestamp = Date.now();
    const dataFolder = inputs.dataFolder;
    const dataFile = `${dataFolder}/instagram.json`;
    const imageFolder = inputs.imageFolder;
    const endpoint = 'https://graph.instagram.com';
    const userId = process.env.INSTAGRAM_USER_ID;
    const fields = 'caption,media_url,media_type,permalink';
    const numberImages = inputs.imageCount;
    const sizes = [360, 720, 1024, 1250, 1440];
    const token = process.env.INSTAGRAM_ACCESS_TOKEN;
    const instagramAPIUrl = `${endpoint}/${userId}/media/?fields=${fields}&limit=${numberImages}&access_token=${token}`;

    fs.mkdirSync(imageFolder, { recursive: true });
    fs.mkdirSync(dataFolder, { recursive: true });

    console.log('Instagram API url constructed:',  instagramAPIUrl);
    console.log('Fetching',chalk.yellow(numberImages),'instagram images.');

    let instagramResponse;
    let instagramData;

    try {
      const response = await axios.get(instagramAPIUrl);
      console.log('Instagram API success - Return status:', chalk.green(response.status));
      instagramResponse = response.data;
    } catch (err) {
      console.log('Instagram API failure - Return status:', chalk.red(err.status));
      console.log(err);
    }

    // If we didn't receive data, fail the plugin but not the build
    if(!instagramResponse){
      utils.build.failBuild(`The Instagram feed did not return data.\Halting the build.`);
      return;
    }

    // create the instagram JSON and write it out and cache it
    instagramData = [];
    let i=1;
    for (const image of instagramResponse.data) {
      // skip videos
      if (image.media_type === 'VIDEO') continue;
      let localImageFilenamePrefix = `${timestamp}-${i}`;
      instagramData.push({
        "id": image.id,
        "caption": image.caption,
        "media_type": image.media_type,
        "instagramURL": image.permalink,
        "sourceImageURL": image.media_url,
        "localImageFilenamePrefix": localImageFilenamePrefix
      });
      i++
    }
    await fs.writeFileSync(dataFile, JSON.stringify(instagramData));
    console.log("Instagram data fetched and written to json data file ",chalk.green(dataFile));

    console.log("Iterating over",chalk.yellow(instagramData.length),"Instagram images.");

    for (const image in instagramData) {
      let { localImageFilenamePrefix, sourceImageURL } = instagramData[image];
      let localImageJpg = `${imageFolder}/${localImageFilenamePrefix}.jpg`;
      
      const writer = fs.createWriteStream(localImageJpg);
      return Axios({
        method: 'get',
        url: sourceImageURL,
        responseType: 'stream',
      }).then(response => {
        return new Promise((resolve, reject) => {
          console.log('Instagram image retrieval success - return status:', chalk.green(response.status))
          response.data.pipe(writer);
          let error = null;
          writer.on('error', err => {
            error = err;
            writer.close();
            reject(err);
          });
          writer.on('close', () => {
            if (!error) {
              resolve(true);
              console.log("Image written to:", chalk.green(localImageJpg));
              for (const size in sizes) {
                outputFilenameWebp = `${imageFolder}/${localImageFilenamePrefix}-${size}.webp`
                outputFilenameJpg = `${imageFolder}/${localImageFilenamePrefix}-${size}.jpg`
                sharp(localImageJpg)
                .resize(size, size,{fit: 'cover'})
                .webp({ lossless: true })
                .toFile(outputFilenameWebp);
                console.log("Converted",chalk.yellow(inputFileName),"to", chalk.green(outputFilenameWebp));        
                sharp(localImageJpg)
                .resize(size, size,{fit: 'cover'})
                .toFile(outputFileNameJpg);
                console.log("Converted",chalk.yellow(inputFileName),"to", chalk.green(outputFileNameJpg));      
              }
            }
          });
        });
      });
    }
    console.log(chalk.cyanBright("============================="));
    console.log(chalk.cyanBright("= Instagram images finished ="));
    console.log(chalk.cyanBright("============================="));
  }
}