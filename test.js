const WebSocket = require("ws");

const ws = new WebSocket('ws://localhost:8080', { perMessageDeflate: false })

ws.on('open', function() {
  console.log('connection to websocket successful')

  setInterval(() => { 
    let payload = {
      mac_addr: 'aa:bb:cc:dd:ee:ff',
      session_uuid: '123456789123456789',
      net_protocol: 'WebSocket',
      datapoint: 'Msg from Node.js localhost'
    }
    ws.send(JSON.stringify(payload)) 

  }, 5000)
})