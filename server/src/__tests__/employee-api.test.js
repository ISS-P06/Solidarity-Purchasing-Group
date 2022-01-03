import request from 'supertest';
import session from 'supertest-session';

import app from '../app';
import { restoreBackup } from '../db';

/**
 * During test the database can be modified, so we need to
 * restore its state from a backup
 */
afterAll(() => {
  restoreBackup();
});

// Auth session for logged user tests
const testSession = session(app);
let authSession_employee = null;

// Login as a farmer
beforeEach((done) => {
  testSession
    .post('/api/sessions')
    .send({ username: 'pentolino', password: 'pentolino' })
    .end((err) => {
      if (err) return done(err);
      authSession_employee = testSession;
      return done();
    });
});

// --- Test suites --- //

describe('Test the clients topup api', () => {
    test('It should respond to the GET method', function (done) {
        authSession_employee.get('/api/clients').expect(200).end(done);
    });

    test('It should respond to the PUT method', function (done) {
        const id = 1;
        const amount = 100;

        authSession_employee.put('/api/clients/topup').send({ amount, id }).expect(200).end(done);
    });

    test('it should fail to the PUT methoh (low amount)', function (done) {
        const id = 1;
        const amount = 3;

        authSession_employee.put('/api/clients/topup').send({ amount, id }).expect(422).end(done);
    });

    test('it should fail to the PUT methoh (missing parameter)', function (done) {
        const amount = 50;

        authSession_employee.put('/api/clients/topup').send({ amount }).expect(422).end(done);
    });
});

describe('Test the get customers api', () => {
    test('It should respond to the GET method', function (done) {
        authSession_employee.get('/api/clients').expect(200).end(done);
    });
});

describe('Test POST order ', function () {
    test('responds with json', function (done) {
        authSession_employee
        .post('/api/orders')
        .send({ clientID: 1, order: [{ id: 55, quantity: 10.0 }] })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
            if (err) return done(err);
            return done();
        });
    });
});

describe('Test the orders path', () => {
  test('It should response GET api/orders', function (done) {
    authSession_employee.get('/api/orders').expect(200).end(done);
  });

  test('It should response GET api/orders/1', function (done) {
    authSession_employee.get('/api/orders/1').expect(200).end(done);
  });
});

