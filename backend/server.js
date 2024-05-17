const { Server } = require('socket.io');
const { createServer } = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');

const { auth } = require('./auth');

const PORT = process.env.PORT || 4000;

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/login', auth);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

httpServer.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}.`);
});

let startTime = 0;
io.on('connect', (socket) => {
  const username = `User ${socket.id.toString().slice(0, 6)}`;
  console.log(`${username} is connected.`);

  socket.on('start', (data) => {
    console.log(data);
    startTime = new Date().getTime();
    socket.broadcast.emit('start', data);
  });

  socket.on('answer', (data) => {
    console.log(data);
    const delta = new Date().getTime() - startTime;
    socket.broadcast.emit('answer', { ...data, time: delta / 1000 });
  });

  socket.on('show_answer', (data) => {
    console.log(data);
    socket.broadcast.emit('show_answer', data);
  });

  socket.on('disconnect', () => {
    console.log(`${username} is disconnected.`);
  });
});
