exports.handler = async () => ({
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=86400',
  },
  body: JSON.stringify({ key: process.env.GOOGLE_MAPS_API_KEY || '' }),
});
