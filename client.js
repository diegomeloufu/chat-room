const net = require('net');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const client = new net.Socket();
const serverAddress = process.argv[2];
const serverPort = process.argv[3];
const clientId = process.argv[4];

client.connect(serverPort, serverAddress, () => {
  console.log(`Connected to server at ${serverAddress}:${serverPort}`);
  client.write(`LOGIN ${clientId}`);
});

client.on('data', (data) => {
  console.log(data.toString().trim());
});

client.on('close', () => {
  console.log('Connection closed');
});

rl.on('line', (input) => {
  client.write(input);
});

rl.on('close', () => {
  client.write(`LOGOFF ${clientId}`);
  client.end();
});
