/* tslint:disable:no-implicit-dependencies no-backbone-get-set-outside-model */
import * as http from 'http';
import * as request from 'supertest';

import {CalendlyServerApp} from '../../src/server/CalendlyServerApp';

describe('Calendly Server App', () => {
  const PORT = 5000;
  let app: CalendlyServerApp;
  let server: http.Server;

  beforeEach(() => {
    app = new CalendlyServerApp(PORT);
    server = app.initServer();
  });

  afterEach((done) => {
    server.close(done);
  });

  it('responds to POST /webhook with valid data', (done) => {
    request(server)
      .post('/webhook')
      .set('Content-Type', 'application/json')
      .send({})
      .expect(201, done);
  });
});
