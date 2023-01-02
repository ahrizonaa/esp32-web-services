import { MongoClient, ServerApiVersion } from "mongodb";

const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}

export default allowCors(async function handler(request, response) {
  const mongo_uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@esp32sensordata.wqwz88a.mongodb.net/?retryWrites=true&w=majority`;
  const client = new MongoClient(mongo_uri, { serverApi: ServerApiVersion.v1 });

  try {
    await client.connect();
  } catch(ex) {
    console.log(ex)
  }

  let records = await client.db('ESP32SensorData').collection('WebSocketDataFeed').find({}).toArray();
  return response.status(200).json(records);
})