'use strict';

const express = require('express');
const path = require('path');
const cors = require('cors');
const { createServer } = require('http');

const WebSocket = require('ws');

const app = express();
app.use(cors())
//app.use(express.static(path.join(__dirname, '/public')));

const server = createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', function (ws) {
  console.log('new conneciton established')
  ws.on('message', function(msgStr) {
    //const msg = JSON.parse(msgStr)
    console.log(msgStr.toString())
  })

  ws.on('close', function () {
    console.log('closing client connection');
  });
});

server.listen(8080, function () {
  console.log('Listening on http://0.0.0.0:8080');
});
