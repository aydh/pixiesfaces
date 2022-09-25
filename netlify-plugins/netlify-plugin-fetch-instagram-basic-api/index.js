const process   = require('process');
const axios     = require('axios');
const fs        = require('fs');
const chalk     = require('chalk');
const sharp     = require('sharp');

const downloadFile = async (fileUrl, outputLocationPath) => {
  const writer = fs.createWriteStream(outputLocationPath);

  return axios({
    method: 'get',
    url: fileUrl,
    responseType: 'stream',
  }).then(response => {

    //ensure that the user can call `then()` only when the file has
    //been downloaded entirely.

    return new Promise((resolve, reject) => {
      console.log('File retrieval success - return status:', chalk.green(response.status))
      response.data.pipe(writer);
      let error = null;
      writer.on('error', err => {
        error = err;
        writer.close();
        reject(err);
      });
      writer.on('close', () => {
        if (!error) {
          console.log("File written to:", chalk.green(outputLocationPath));
          resolve(true);
        }
        //no need to call the reject here, as it will have been called in the
        //'error' stream;
      });
    });
  });
};

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

    for (let j=0; j < instagramData.length; j++) {
      console.log("j=",j);
      let { localImageFilenamePrefix, sourceImageURL } = instagramData[j];
      let localImageJpg = `${imageFolder}/${localImageFilenamePrefix}.jpg`;

      await downloadFile(sourceImageURL, localImageJpg)
      
      for (let k=0;k < sizes.length; k++) {
        console.log("k=",k);
        let size=sizes[k];
        outputFilenameWebp = `${imageFolder}/${localImageFilenamePrefix}-${size}.webp`;
        outputFilenameJpg = `${imageFolder}/${localImageFilenamePrefix}-${size}.jpg`;
        sharp(localImageJpg)
          .resize(size, size,{fit: 'cover'})
          .webp({ lossless: true })
          .toFile(outputFilenameWebp);
        console.log("Converted",chalk.yellow(localImageJpg),"to", chalk.green(outputFilenameWebp));        
        sharp(localImageJpg)
          .resize(size, size,{fit: 'cover'})
          .toFile(outputFilenameJpg);
        console.log("Converted",chalk.yellow(localImageJpg),"to", chalk.green(outputFilenameJpg)); 
      }
      console.log("NEXT");
    }
    console.log(chalk.cyanBright("============================="));
    console.log(chalk.cyanBright("= Instagram images finished ="));
    console.log(chalk.cyanBright("============================="));
  }
}