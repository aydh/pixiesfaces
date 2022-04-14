const handler = async (event) => {
  console.log('Got pinged')
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
