const WebSocket = require('ws');

const PORT = process.env.PORT || 3000;
const wss = new WebSocket.Server({ port: PORT });

const clients = {};

wss.on('connection', (socket) => {
  socket.on('message', (message) => {
    const data = message.toString().trim();
    const [command, clientId, ...rest] = data.split(' ');

    switch (command) {
      case 'LOGIN':
        clients[clientId] = socket;
        console.log(`${clientId} logged in`);
        break;

      case 'LOGOFF':
        delete clients[clientId];
        console.log(`${clientId} logged off`);
        break;

      case 'MSG':
        const text = rest.join(' ');
        if (clientId === 'ALL') {
          broadcast(text, socket);
        } else {
          sendToClient(clientId, text);
        }
        break;

      default:
        console.log(`Unknown command: ${command}`);
    }
  });

  socket.on('close', () => {
    for (let clientId in clients) {
      if (clients[clientId] === socket) {
        delete clients[clientId];
        console.log(`${clientId} disconnected`);
        break;
      }
    }
  });
});

const broadcast = (message, senderSocket) => {
  for (let clientId in clients) {
    if (clients[clientId] !== senderSocket) {
      clients[clientId].send(message);
    }
  }
};

const sendToClient = (clientId, message) => {
  if (clients[clientId]) {
    clients[clientId].send(message);
  } else {
    console.log(`Client ${clientId} not found`);
  }
};

wss.on('listening', () => {
  console.log(`Server is listening on port ${PORT}`);
});
