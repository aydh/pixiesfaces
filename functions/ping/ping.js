const qs = require('qs')

const handler = async (event) => {
  console.log('Got pinged')
  const params = qs.stringify(event.queryStringParameters)
  console.log('params', params)
  try {
    return {
      statusCode: 200,
      headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow from anywhere 
      },
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
