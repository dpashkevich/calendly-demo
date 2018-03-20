import * as express from 'express';
import * as path from 'path';
import * as http from 'http';
import * as io from 'socket.io';
import * as bodyParser from 'body-parser';

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

app.get('/placeholder', (req, res) => res.send('World!'));

app.post('/webhook', (req, res) => {
  console.log('Received webhook, body: ', req.body);
  socketIo.emit('new event', JSON.stringify(req.body));
  res.sendStatus(201);
});

server.listen(PORT, () => console.log(`Listening on ${ PORT }`));
