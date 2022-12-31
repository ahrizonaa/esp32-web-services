const WebSocket = require("ws");

const ws = new WebSocket('ws://localhost:8080', { perMessageDeflate: false })

ws.on('open', function() {
  console.log('connection to websocket successful')

  setInterval(() => { ws.send('Msg from Node.js Localhost') }, 5000)
})