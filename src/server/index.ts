import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import * as io from 'socket.io';

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const socketIo = io(server);

socketIo.on('connection', (socket) => {
  console.log(`socket ${socket.id} connected`);
  socket.on('disconnect', () => {
    console.log(`socket ${socket.id} disconnected`);
  });
});

app.use(express.static(path.join(__dirname, '../../public')));
app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
  socketIo.emit('new event', JSON.stringify(req.body));
  res.sendStatus(201);
});

server.listen(PORT, () => console.log(`Listening on ${ PORT }`));
