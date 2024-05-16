const { Server } = require('socket.io');
const { createServer } = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');

const express = require('express');

const PORT = process.env.PORT || 4000;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

httpServer.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}.`);
});

io.on('connect', (socket) => {
  const username = `User ${socket.id.toString().slice(0, 6)}`;
  console.log(`${username} is connected.`);

  socket.on('disconnect', () => {
    console.log(`${username} is disconnected.`);
  });
});
