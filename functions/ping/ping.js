const process = require('process');
const axios = require('axios');
const qs = require('qs');

const handler = async function (event) {
  console.log('ping.js was called...');

  // Get the auth code from URL query parameter
  code = event['queryStringParameters']['code'];
  console.log('code:', code);

  // Set all the environment variables
  const short_lived_token_url = 'https://api.instagram.com/oauth/access_token';
  const long_lived_token_exchange_url = 'https://graph.instagram.com/access_token';
  const instagram_client_id = process.env.INSTAGRAM_CLIENT_ID;
  const instagram_client_secret = process.env.INSTAGRAM_CLIENT_SECRET;
  const short_lived_grant_type = 'authorization_code';
  const long_lived_grant_type = 'ig_exchange_token';
  const redirect_url = process.env.INSTAGRAM_REDIRECT_URL;

  // Payload to use in post to get short lived access token
  const short_lived_token_payload = {
    'client_id': instagram_client_id,
    'client_secret': instagram_client_secret,
    'grant_type': short_lived_grant_type,
    'redirect_uri': redirect_url,
    'code': code
  };
  console.log('short_lived_token_payload: ', short_lived_token_payload);

  try {
    const { resp } = await axios.post(short_lived_token_url, qs.stringify(short_lived_token_payload))
    .then(function (response) {
      console.log('----------short lived token success----------');
      console.log(response.status);
      console.log(response.data);
      short_lived_accessToken = response.data.access_token;
      console.log('----------end of short lived token success----------');
      /*return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', // Allow from anywhere 
        },
        body: response.data.access_token
      }*/
      const long_lived_token_exchange_url_params = `${long_lived_token_exchange_url}/?grant_type=${long_lived_grant_type}&client_secret=${instagram_client_secret}&access_token=${short_lived_accessToken}`;
      console.log('long_lived_token_exchange_url_params: ', long_lived_token_exchange_url_params);

      const { res } = axios.get(long_lived_token_exchange_url_params);
      console.log('----------long lived token exchange success----------');
      console.log('status: ', res.status);
      // parse response to get long lived access token
      long_lived_access_token = res.data.access_token;
      console.log(long_lived_accessToken);
      console.log('----------end of long lived token exchange success----------');
      // Return the original call with access token in body
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', // Allow from anywhere 
        },
        body: long_lived_accessToken
      }

    })
    .catch(function (error) {
      console.log('----------short lived token post error----------');
      console.log(error);
      console.log('----------end of short lived token post error----------');
      return {
        statusCode: 500
      }
    });

  } catch (err) {
    console.log('----------error----------');
    console.log(err);
    console.log('----------end error----------');
    const { data, headers, status, statusText } = err.response
    return {
      statusCode: err.response.status,
      body: JSON.stringify({ status, statusText, headers, data })
    }
  }
}

module.exports = { handler }
