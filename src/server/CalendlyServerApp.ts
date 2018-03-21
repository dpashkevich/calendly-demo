import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import * as io from 'socket.io';

/**
 * Server-side app to manage Calendly events
 */
export class CalendlyServerApp {
  private recentEvents: object[] = [];
  private MAX_RECENT_EVENTS = 10;

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

    app.get('/recentEvents', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(this.recentEvents));
    });

    app.post('/webhook', (req, res) => {
      this.recentEvents.push(req.body);
      if (this.recentEvents.length > this.MAX_RECENT_EVENTS) {
        this.recentEvents.shift();
      }
      socketIo.emit('new event', JSON.stringify(req.body));
      res.sendStatus(201);
    });

    server.listen(this.port, () => console.log(`Listening on ${this.port}`));

    return server;
  }
}
