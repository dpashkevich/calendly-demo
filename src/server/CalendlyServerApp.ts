import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import * as io from 'socket.io';

/**
 * Server-side app to manage Calendly events
 */
export class CalendlyServerApp {

  constructor(private port: number) {}

  public initServer() {
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

    server.listen(this.port, () => console.log(`Listening on ${this.port}`));

    return server;
  }
}
