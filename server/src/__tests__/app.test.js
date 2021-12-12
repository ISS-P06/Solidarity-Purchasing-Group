import request from 'supertest';
import session from 'supertest-session';

import app from '../app';
import { farmerDAO } from '../dao';
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
let authenticatedSession = null;

beforeEach((done) => {
  testSession
    .post('/api/sessions')
    .send({ username: 'pentolino', password: 'pentolino' })
    .end((err) => {
      if (err) return done(err);
      authenticatedSession = testSession;
      return done();
    });
});

/** TEST SUITES */

describe('Test the get products api', () => {
  test('It should respond to the GET method', function (done) {
    authenticatedSession.get('/api/products').expect(200).end(done);
  });
});

describe("Test the get farmer's products api", () => {
  test('It should respond 200 to the GET method', function (done) {
    authenticatedSession.get('/api/farmer/3/products').expect(200).end(done);
  });

  test('It should respond 404 to the GET method', function (done) {
    authenticatedSession.get('/api/farmers/3/products').expect(404).end(done);
  });
});

describe('Test the query to get available products supplied for next week by a farmer', () => {
  test('It should return a non-empty object', async () => {
    const dummyRes = await farmerDAO
      .test_addDummyProductSupplies()
      .then(() => {
        return 'ok';
      })
      .catch((err) => {
        console.log(err);
        return 'not ok';
      });

    expect(dummyRes).toBe('ok');

    const date = new Date('January, 1 2999 00:00:00');
    const result = await farmerDAO.listSuppliedFarmerProducts(3, date);

    expect(result[0].name).toBe('equijoin');
  });
});

describe('Test the query to get available products supplied for next week by a farmer', () => {
  test('It should return a non-empty object', async () => {
    const dummyRes = await farmerDAO
      .test_addDummyProductSupplies()
      .then(() => {
        return 'ok';
      })
      .catch((err) => {
        console.log(err);
        return 'not ok';
      });

    expect(dummyRes).toBe('ok');

    const date = new Date('January, 1 2999 00:00:00');

    const result = await farmerDAO.listSuppliedFarmerProducts(3, date);

    expect(result[0].name).toBe('equijoin');
  });
});

describe('Test the get all the products supplied the next week linked by a farmer with {userId}', () => {
  test('It should respond 200 to the GET method', function (done) {
    authenticatedSession.get('/api/farmer/3/products').expect(200).end(done);
  });

  test('It should respond 404 to the GET method', function (done) {
    authenticatedSession.get('/api/farmer/3/products/supp').expect(404).end(done);
  });
});

describe('Test the post for adding expected available product amounts for the next week', () => {
  test('It should respond 200 to the POST method', function (done) {
    const data = { productID: 4, quantity: 10, price: 10 };
    authenticatedSession.post('/api/farmer/products/available').send(data).expect(200).end(done);
  });

  test('It should respond 404 to the POST method', function (done) {
    const data = { productID: 4, quantity: 10, price: 10 };
    authenticatedSession.post('/api/farmers/product/available').send(data).expect(404).end(done);
  });
  test('It should respond 422 to the POST method', function (done) {
    const data = { productID: '4', price: 10 };
    authenticatedSession.post('/api/farmer/products/available').send(data).expect(422).end(done);
  });
});

describe('Test the delete for remove expected available product amounts for the next week', () => {
  test('It should respond 200 to the POST method', function (done) {
    const data = { productID: 4 };
    authenticatedSession.delete('/api/farmer/products/available').send(data).expect(200).end(done);
  });

  test('It should respond 404 to the DELETE method', function (done) {
    const data = { productID: 4 };
    authenticatedSession.delete('/api/farmers/product/available').send(data).expect(404).end(done);
  });
  test('It should respond 422 to the DELETE method', function (done) {
    const data = { productID: 'prod' };
    authenticatedSession.delete('/api/farmer/products/available').send(data).expect(422).end(done);
  });
});

describe('Test the get client orders api', () => {
  test('It should respond 200 to the GET method', function (done) {
    authenticatedSession.get('/api/clients/4/orders').expect(200).end(done);
  });

  test('It should respond 404 to the GET method', function (done) {
    authenticatedSession.get('/api/clients//orders').expect(404).end(done);
  });

  test('It should respond 200 to the GET method', function (done) {
    authenticatedSession.get('/api/clients/4/orders/2').expect(200).end(done);
  });

  test('It should respond 404 to the GET method', function (done) {
    authenticatedSession.get('/api/clients//orders/2').expect(404).end(done);
  });
});

describe('Test the get virtual time clock', () => {
  test('It should respond to the GET method', () => {
    return request(app).get('/api/time').expect(200);
  });

  test('It should respond to the PUT method', () => {
    const time = '2021-11-02T10:30:26.318Z';
    return request(app).put('/api/time').send({ time }).expect(200);
  });

  test('It should fail to the PUT method', () => {
    const time = '2021-11-02T10:66:26.318Z';
    return request(app).put('/api/time').send({ time }).expect(422);
  });
});

describe('Test the clients topup api', () => {
  test('It should respond to the GET method', function (done) {
    authenticatedSession.get('/api/clients').expect(200).end(done);
  });

  test('It should respond to the PUT method', function (done) {
    const id = 1;
    const amount = 100;

    authenticatedSession.put('/api/clients/topup').send({ amount, id }).expect(200).end(done);
  });

  test('it should fail to the PUT methoh (low amount)', function (done) {
    const id = 1;
    const amount = 3;

    authenticatedSession.put('/api/clients/topup').send({ amount, id }).expect(422).end(done);
  });

  test('it should fail to the PUT methoh (missing parameter)', function (done) {
    const amount = 50;

    authenticatedSession.put('/api/clients/topup').send({ amount }).expect(422).end(done);
  });
});

describe('Test the get customers api', () => {
  test('It should respond to the GET method', function (done) {
    authenticatedSession.get('/api/clients').expect(200).end(done);
  });
});

describe('Test POST order ', function () {
  test('responds with json', function (done) {
    authenticatedSession
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

// --- Login/logout routes tests
describe('Test the login APIs', () => {
  test('It should respond to the POST method', () => {
    const user = { username: 'pentolino', password: 'pentolino' };
    return request(app).post('/api/sessions').send(user).expect(200);
  });

  test('The POST method should fail', () => {
    const user = { username: 'pentolino', password: 'a' };
    return request(app).post('/api/sessions').send(user).expect(401);
  });

  test('The GET method should fail', () => {
    return request(app).get('/api/sessions/current').expect(401);
  });

  test('It should respond to the DELETE method', () => {
    return request(app).delete('/api/sessions/current').expect(200);
  });

  test('The GET method shod respond 200', function (done) {
    authenticatedSession.get('/api/sessions/current').expect(200).end(done);
  });
});
// --- --- --- //

describe('Test the orders path', () => {
  test('It should response GET api/orders', function (done) {
    authenticatedSession.get('/api/orders').expect(200).end(done);
  });

  test('It should response GET api/orders/1', function (done) {
    authenticatedSession.get('/api/orders/1').expect(200).end(done);
  });
});

describe('Test the client path', () => {
  test('It should response GET api/client/4/basket', function (done) {
    authenticatedSession.get('/api/client/4/basket').expect(200).end(done);
  });
});

describe('Test add or delete a product into/from the basket', () => {
  test('Remove a product; It should response 200', function (done) {
    const data = { productId: 4 };
    authenticatedSession.delete('/api/client/4/basket/remove').send(data).expect(200).end(done);
  });

  test('Add a product; It should response 200', function (done) {
    const data = { productId: 4, reservedQuantity: 0.1 };
    authenticatedSession.post('/api/client/4/basket/add').send(data).expect(200).end(done);
  });
});

describe('Test failure add or delete a product into/from the basket', () => {
  test('Add a product; It should response 422 because validation fails', function (done) {
    const data = { productId: '', reservedQuantity: 0.1 };
    authenticatedSession.post('/api/client/4/basket/add').send(data).expect(422).end(done);
  });

  test('Remove a product; It should response 422 because validation fails', function (done) {
    const data = { productId: '' };
    authenticatedSession.delete('/api/client/4/basket/remove').send(data).expect(422).end(done);
  });
});

describe('test client insertion', () => {
  test('test post method to insert new client', () => {
    const client = {
      name: 'Mario',
      surname: 'Rossi',
      balance: 5,
      mail: 'mario@rossi.com',
      typeUser: 'client',
      phone: '123456789',
      username: 'MarioRossi',
      password: 'MarioRossi',
      address: 'Milano, via Roma',
    };

    return request(app).post('/api/register_user').send(client).expect(200);
  });

  test('test post method failure to insert new client due to wrong parameters', () => {
    const clientF = {};
    return request(app)
      .post('/api/register_user')
      .send(clientF)
      .then((response) => {
        expect(response.statusCode).toBe(422);
      });
  });
});

describe('test user insertion', () => {
  test('testing post method to insert a shop employee in the backend', () => {
    const shop_employee = {
      typeUser: 'shop_employee',
      name: 'saly',
      surname: 'ashraf',
      phone: '123456789',
      mail: 'saly@ashraf.com',
      username: 'salyAshraf',
      password: 'salyAshraf',
    };
    return request(app)
      .post('/api/register_user')
      .send(shop_employee)
      .then((response) => {
        expect(response.statusCode).toBe(200);
      });
  });

  test('test failure of post method due to missing parameters', () => {
    return request(app)
      .post('/api/register_user')
      .send({
        typeUser: 'shop_employee',
      })
      .then((response) => {
        expect(response.statusCode).toBe(422);
      });
  });

  test('test farmer insertion into backend with post method', () => {
    const farmer = {
      typeUser: 'farmer',
      name: 'Muhammad',
      surname: 'Ibrahim',
      mail: 'mohammad@ibrahim.us',
      phone: '123456789',
      address: 'Milano',
      farmName: 'paradise vegetables',
      username: 'muhammadibrahim',
      password: 'muhammadibrahim',
    };
    return request(app)
      .post('/api/register_user')
      .send(farmer)
      .then((response) => {
        expect(response.statusCode).toBe(200);
      });
  });

  test('test failure of post method due to missing parameters with farmer insertion', () => {
    return request(app)
      .post('/api/register_user')
      .send({
        typeUser: 'farmer',
      })
      .then((response) => {
        expect(response.statusCode).toBe(422);
      });
  });
});

describe('test place a order', () => {
  test('Submit an order; It should response 200', function (done) {
    const userId = 2;
    authenticatedSession.post(`/api/client/${userId}/basket/buy`).send().expect(200).end(done);
  });

  test('Submit an order; It should response 422', function (done) {
    const userId = 'ciao';
    authenticatedSession.post(`/api/client/${userId}/basket/buy`).send().expect(422).end(done);
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

    authenticatedSession
      .post('/api/insert_product_description')
      .send(productDescription)
      .expect(200, done);
  });

  test('test add product description expect failure', function (done) {
    const productDescription = {};
    authenticatedSession
      .post('/api/insert_product_description')
      .send(productDescription)
      .expect(422)
      .end(done);
  });
});

describe('Test schedule a bag delivery', () => {


  test('Schedule a bag delivery; It should response 200', () => {
    const data = {address: "Via Marco Polo 11", date: "01-01-2020", time:"13:10"};
    return  authenticatedSession
        .post('/api/orders/3/deliver/schedule')
        .send(data)
        .then((response) => {
          expect(response.statusCode).toBe(200);
        })
  });
  test('Schedule a bag delivery; It should response 422 because validation fails', () => {
    const data = {address: "Via Marco Polo 11", date: "01-01-2020", time:"13:10"};
    return  authenticatedSession
        .post('/api/orders/marco/deliver/schedule')
        .send(data)
        .then((response) => {
          expect(response.statusCode).toBe(422);
        });
  });
  test('Schedule a bag delivery; It should response 404', () => {
    const data = {address: "Via Marco Polo 11", date: "01-01-2020", time:"13:10"};
    return request(app)
        .post('/api/order/3/delivery/schedule')
        .send(data)
        .then((response) => {
          expect(response.statusCode).toBe(404);
        });
  });


});