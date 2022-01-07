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

// Login as a generic user
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