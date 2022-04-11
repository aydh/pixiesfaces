const process = require('process')

const axios = require('axios')
const qs = require('qs')

const handler = async function (event) {

  // apply our function to the queryStringParameters and assign it to a variable
  const params = qs.stringify(event.queryStringParameters)
  console.log('params', params)

  // Get env var values defined in our Netlify site UI
  const endpoint = 'https://graph.instagram.com';
  const userId = process.env.INSTAGRAM_USER_ID;
  const fields = 'caption,media_url,media_type,timestamp';
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const limit = 5;
  const url = `${endpoint}/${userId}/media/?fields=${fields}&access_token=${token}&count=${limit}`;
  console.log('Constructed URL is ...', url)

  try {
    const { data } = await axios.get(url)
    // refer to axios docs for other methods if you need them
    // for example if you want to POST data:
    //    axios.post('/user', { firstName: 'Fred' })
    return {
      statusCode: 200,
      headers: {
        'content-type': 'application/json',
        "Access-Control-Allow-Origin": "*", // Allow from anywhere 
      },
      body: JSON.stringify(data),
    }
  } catch (error) {
    const { data, headers, status, statusText } = error.response
    return {
      statusCode: error.response.status,
      body: JSON.stringify({ status, statusText, headers, data }),
    }
  }
}

module.exports = { handler }
