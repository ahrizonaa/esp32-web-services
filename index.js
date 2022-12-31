'use strict';

const express = require('express');
const path = require('path');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const mongo_uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@esp32sensordata.wqwz88a.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const { createServer } = require('http');

const WebSocket = require('ws');

const app = express();
app.use(cors())
//app.use(express.static(path.join(__dirname, '/public')));

const server = createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', async function (ws) {
  console.log('new conneciton established')
  ws.on('message', async function(msgStr) {
    let payload = JSON.parse(msgStr.toString())
    console.log(msgStr.toString())
    payload['timestamp'] = new Date(Date.now()).toISOString()

    client.connect(async function(err) {
      if (err) {
        console.log(err)
        client.close()
        return
      } else {
        client.db("ESP32SensorData").collection("WebSocketDataFeed").insertOne(payload, function(err, res) {
          if (err) {
            console.log(err)
          } else {
            console.log('inserted to mongodb')
          }
          client.close()
        })
      }

    });
  })

  ws.on('close', function () {
    console.log('closing client connection');
  });
});

server.listen(8080, function () {
  console.log('Listening on http://0.0.0.0:8080');
});
