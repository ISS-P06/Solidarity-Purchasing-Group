import request from 'supertest';
import session from 'supertest-session';

import app from '../app';
import { restoreBackup } from '../db';
import { basketDAO } from '../dao';

/**
 * During test the database can be modified, so we need to
 * restore its state from a backup
 */
afterAll(() => {
  restoreBackup();
});

// Auth session for logged user tests
const testSession = session(app);
let authSession_client = null;

// Login as a farmer
beforeEach((done) => {
  testSession
    .post('/api/sessions')
    .send({ username: 'teiera', password: 'teiera123' })
    .end((err) => {
      if (err) return done(err);
      authSession_client = testSession;
      return done();
    });
});

// --- Test suites --- //
describe('Test the get client orders api', () => {
	test('It should respond 200 to the GET method', function (done) {
		authSession_client.get('/api/clients/4/orders').expect(200).end(done);
	});

	test('It should respond 404 to the GET method', function (done) {
		authSession_client.get('/api/clients//orders').expect(404).end(done);
	});

	test('It should respond 200 to the GET method', function (done) {
		authSession_client.get('/api/clients/4/orders/2').expect(200).end(done);
	});

	test('It should respond 404 to the GET method', function (done) {
		authSession_client.get('/api/clients//orders/2').expect(404).end(done);
	});
});
/*
describe('Test the client path', () => {
  test('It should response GET api/client/4/basket', function (done) {
    authSession_client.get('/api/client/4/basket').expect(200).end(done);
  });
});
*/
describe('test place a order', () => {
  test('Submit an order; It should response 200', function (done) {
    const userId = 2;
    authSession_client.post(`/api/client/${userId}/basket/buy`).send().expect(200).end(done);
  });

  test('Submit an order; It should response 422', function (done) {
    const userId = 'ciao';
    authSession_client.post(`/api/client/${userId}/basket/buy`).send().expect(422).end(done);
  });
});

describe('Test schedule a bag delivery', () => {
    test('Schedule a bag delivery; It should response 200', () => {
        const data = {address: "Via Marco Polo 11", date: "01-01-2020", time:"13:10"};
        return  authSession_client
            .post('/api/orders/1/deliver/schedule')
            .send(data)
            .then((response) => {
                expect(response.statusCode).toBe(200);
            })
    });
    test('Schedule a bag delivery; It should response 422 because validation fails', () => {
        const data = {address: "Via Marco Polo 11", date: "01-01-2020", time:"13:10"};
        return  authSession_client
            .post('/api/orders/marco/deliver/schedule')
            .send(data)
            .then((response) => {
                expect(response.statusCode).toBe(422);
            });
    });
    test('Schedule a bag delivery; It should response 404', () => {
        const data = {address: "Via Marco Polo 11", date: "01-01-2020", time:"13:10"};
        return authSession_client
            .post('/api/order/1/delivery/schedule')
            .send(data)
            .then((response) => {
                expect(response.statusCode).toBe(404);
            });
    });
});

describe('Test failure add or delete a product into/from the basket', () => {
  test('Add a product; It should response 422 because validation fails', function (done) {
    const data = { productId: '', reservedQuantity: 0.1 };
    authSession_client.post('/api/client/4/basket/add').send(data).expect(422).end(done);
  });

  test('Remove a product; It should response 422 because validation fails', function (done) {
    const data = { productId: '' };
    authSession_client.post('/api/client/4/basket/remove').send(data).expect(422).end(done);
  });
});
/*
describe('Test add or delete a product into/from the basket', () => {
  beforeAll(async () => {
    await basketDAO.test_addDummyBasketProducts();
  });

  test('Add a product; It should response 200', function (done) {
    const data = { productId: 3, reservedQuantity: 0.1 };
    authSession_client.post('/api/client/4/basket/add').send(data).expect(200).end(done);
  });

  test('Remove a product; It should response 200', function (done) {
    const data = { productId: 4 };
    authSession_client.post('/api/client/4/basket/remove').send(data).expect(200).end(done);
  });
});
*/