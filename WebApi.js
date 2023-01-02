'use strict';

const express = require('express');
const path = require('path');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const mongo_uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@esp32sensordata.wqwz88a.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

client.connect(function(err) {
  if (err) {
    console.log(err)
  }
})

const app = express();

app.use(cors())

app.get('/', (req, res) => {
  res.send('Vibration Sensor Data Api')
})

app.get('/vibrationdata', async (req, res) => {
  let records = await client.db('ESP32SensorData').collection('WebSocketDataFeed').find({}).toArray();
  res.status(200).send(records)
})

app.listen(8080, function () {
  console.log('Listening on http://0.0.0.0:8080');
});
