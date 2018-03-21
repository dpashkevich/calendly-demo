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

  it('does not respond to GET /webhook', (done) => {
    request(server)
      .get('/webhook')
      .expect(404, done);
  });

  it('does not respond to /non-existent', (done) => {
    request(server)
      .get('/non-existent')
      .expect(404, done);
  });

  it('initially an empty array of recent events', (done) => {
    request(server)
      .get('/recentEvents')
      .expect('Content-Type', /json/)
      .expect(200, [], done);
  });

  it('returns recent events', (done) => {
    const events = [
      {event: {uuid: 1}},
      {event: {uuid: 2}},
      {event: {uuid: 3}},
    ];
    /* tslint:disable:no-any */
    let currentPromise: Promise<any> = Promise.resolve();

    // run the async requests in sequence
    events.forEach((e) => {
      currentPromise = currentPromise.then(() => {
        return request(server)
          .post('/webhook')
          .set('Content-Type', 'application/json')
          .send(e)
          .expect(201);
      });
    });

    /* tslint:disable:no-floating-promises */
    currentPromise.then(() => {
      request(server)
      .get('/recentEvents')
      .expect('Content-Type', /json/)
      .expect(200, events, done);
    });
  });

  it('returns only 10 recent events', (done) => {
    const events = [
      {event: {uuid: 1}},
      {event: {uuid: 2}},
      {event: {uuid: 3}},
      {event: {uuid: 4}},
      {event: {uuid: 5}},
      {event: {uuid: 6}},
      {event: {uuid: 7}},
      {event: {uuid: 8}},
      {event: {uuid: 9}},
      {event: {uuid: 10}},
      {event: {uuid: 11}},
      {event: {uuid: 12}},
    ];
    /* tslint:disable:no-any */
    let currentPromise: Promise<any> = Promise.resolve();

    // run the async requests in sequence
    events.forEach((e) => {
      currentPromise = currentPromise.then(() => {
        return request(server)
          .post('/webhook')
          .set('Content-Type', 'application/json')
          .send(e)
          .expect(201);
      });
    });

    const recentEvents = events.slice();
    recentEvents.splice(0, 2);

    /* tslint:disable:no-floating-promises */
    currentPromise.then(() => {
      request(server)
      .get('/recentEvents')
      .expect('Content-Type', /json/)
      .expect(200, recentEvents, done);
    });
  });
});
