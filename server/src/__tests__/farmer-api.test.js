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
let authSession_farmer = null;

// Login as a farmer
beforeEach((done) => {
  testSession
    .post('/api/sessions')
    .send({ username: 'nonnaPapera', password: 'paperino' })
    .end((err) => {
      if (err) return done(err);
      authSession_farmer = testSession;
      return done();
    });
});

// --- Test suites --- //
describe("Test the get farmer's products api", () => {
    test('It should respond 200 to the GET method', function (done) {
        authSession_farmer.get('/api/farmer/3/products').expect(200).end(done);
    });

    test('It should respond 404 to the GET method', function (done) {
        authSession_farmer.get('/api/farmers/3/products').expect(404).end(done);
    });
});

describe('Test the get all the products supplied the next week linked by a farmer with {userId}', () => {
    test('It should respond 200 to the GET method', function (done) {
        authSession_farmer.get('/api/farmer/3/products').expect(200).end(done);
    });

    test('It should respond 404 to the GET method', function (done) {
        authSession_farmer.get('/api/farmer/3/products/supp').expect(404).end(done);
    });
});

describe('Test the post for adding expected available product amounts for the next week', () => {
    test('It should respond 200 to the POST method', function (done) {
        const data = { productID: 4, quantity: 10, price: 10 };
        authSession_farmer.post('/api/farmer/products/available').send(data).expect(200).end(done);
    });

    test('It should respond 404 to the POST method', function (done) {
        const data = { productID: 4, quantity: 10, price: 10 };
        authSession_farmer.post('/api/farmers/product/available').send(data).expect(404).end(done);
    });
    test('It should respond 422 to the POST method', function (done) {
        const data = { productID: '4', price: 10 };
        authSession_farmer.post('/api/farmer/products/available').send(data).expect(422).end(done);
    });
});

describe('Test the delete for remove expected available product amounts for the next week', () => {
    test('It should respond 200 to the POST method', function (done) {
        const data = { productID: 4 };
        authSession_farmer.delete('/api/farmer/products/available').send(data).expect(200).end(done);
    });

    test('It should respond 404 to the DELETE method', function (done) {
        const data = { productID: 4 };
        authSession_farmer.delete('/api/farmers/product/available').send(data).expect(404).end(done);
    });
    test('It should respond 422 to the DELETE method', function (done) {
        const data = { productID: 'prod' };
        authSession_farmer.delete('/api/farmer/products/available').send(data).expect(422).end(done);
    });
});

describe('test adding new product description', () => {
    test('test add successfully product description', function (done) {
        const productDescription = {
        name: 'apple',
        description: 'new kind',
        category: 'fruit',
        unit: 'kg',
        ref_farmer: 3,
        };

        authSession_farmer
        .post('/api/insert_product_description')
        .send(productDescription)
        .expect(200, done);
    });

    test('test add product description expect failure', function (done) {
        const productDescription = {};
        authSession_farmer
        .post('/api/insert_product_description')
        .send(productDescription)
        .expect(422)
        .end(done);
    });
});