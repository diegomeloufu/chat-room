const WebSocket = require('ws');

const serverUrl = process.argv[2] || 'ws://localhost:3000';
const clientId = process.argv[3] || 'client1';

const socket = new WebSocket(serverUrl);

socket.on('open', () => {
  console.log(`Connected to server at ${serverUrl}`);
  socket.send(`LOGIN ${clientId}`);
});

socket.on('message', (data) => {
  console.log(`Received message: ${data}`);
});

socket.on('close', () => {
  console.log('Connection closed');
});

socket.on('error', (error) => {
  console.error(`Connection error: ${error.message}`);
});
