const process = require('process')

const axios = require('axios')
const qs = require('qs')

const handler = async function (event) {
  console.log('ping.js was called...')
  // Get the code from URL query parameter
  code = event['queryStringParameters']['code']

  const short_lived_token_url = 'https://api.instagram.com/oauth/access_token';
  const long_lived_token_exchange_url = 'https://graph.instagram.com/access_token';
  const instagram_client_id = process.env.INSTAGRAM_CLIENT_ID;
  const instagram_client_secret = process.env.INSTAGRAM_CLIENT_SECRET;
  const short_lived_grant_type = 'authorization_code';
  const long_lived_grant_type = 'ig_exchange_token';
  const redirect_url = process.env.INSTAGRAM_REDIRECT_URL;

  const short_lived_token_payload = {
    'client_id': instagram_client_id,
    'client_secret': instagram_client_secret,
    'grant_type': short_lived_grant_type,
    'redirect_url': redirect_url,
    'code': code
  };

  const headers = {
    'content-type': 'application/json'
  }
  
  console.log('short_lived_token_payload: ', short_lived_token_payload)

  try {
    const { resp } = await axios.post(short_lived_token_url, short_lived_token_payload, headers)
    console.log('----------success----------');
    console.log(resp);
    console.log('----------end success----------');
    return {
      statusCode: resp.response.status,
      headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow from anywhere 
      },
      body: JSON.stringify(resp)
    }
  } catch (err) {
    console.log('----------error----------');
    console.log(err);
    console.log('----------end error----------');
    const { data, headers, status, statusText } = err.response
    return {
      statusCode: err.response.status,
      headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow from anywhere 
      },
      body: JSON.stringify({ status, statusText, headers, data })
    }
  }
}

module.exports = { handler }
