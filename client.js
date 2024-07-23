const WebSocket = require('ws');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const serverAddress = process.argv[2];
const clientId = process.argv[3];
const url = `ws://${serverAddress}`;  // Usar ws:// para conexões locais

const socket = new WebSocket(url);

socket.on('open', () => {
  console.log(`Conectado ao servidor em ${serverAddress}`);
  socket.send(`LOGIN ${clientId}`);
});

socket.on('message', (data) => {
  console.log(data.toString().trim());
});

socket.on('close', () => {
  console.log('Conexão encerrada');
});

socket.on('error', (error) => {
  console.error(`Connection error: ${error.message}`);
});

rl.on('line', (input) => {
  socket.send(input);
});

rl.on('close', () => {
  socket.send(`LOGOFF ${clientId}`);
  socket.close();
});
