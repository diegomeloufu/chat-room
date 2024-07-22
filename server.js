const net = require('net');
const clients = {};

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    const message = data.toString().trim();
    const [command, clientId, ...rest] = message.split(' ');

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

  socket.on('end', () => {
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
      clients[clientId].write(message);
    }
  }
};

const sendToClient = (clientId, message) => {
  if (clients[clientId]) {
    clients[clientId].write(message);
  } else {
    console.log(`Client ${clientId} not found`);
  }
};

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
