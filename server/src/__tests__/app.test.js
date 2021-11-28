import request from 'supertest';
import app from '../app';
import { test_removeUser } from '../user-dao';

import { copyFileSync, unlinkSync } from 'fs';

/** During test the database can be modified, so we need to backup its state */

const dbPath = 'database.db';
const backupPath = 'database.db.backup';

// Save database current state
beforeAll(() => {
  copyFileSync(dbPath, backupPath);
});

// Reset database current state
afterAll(() => {
  copyFileSync(backupPath, dbPath);
  unlinkSync(backupPath);
});

/** TEST SUITES */

describe('Test the get products api', () => {
  test('It should respond to the GET method', () => {
    return request(app)
      .get('/api/products')
      .then((response) => {
        expect(response.statusCode).toBe(200);
      });
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
  test('It should respond to the GET method', () => {
    return request(app).get('/api/clients').expect(200);
  });

  test('It should respond to the PUT method', () => {
    const id = 1;
    const amount = 100;

    return request(app).put('/api/clients/topup').send({ amount, id }).expect(200);
  });

  test('it should fail to the PUT methoh (low amount)', () => {
    const id = 1;
    const amount = 3;

    return request(app).put('/api/clients/topup').send({ amount, id }).expect(422);
  });

  test('it should fail to the PUT methoh (missing parameter)', () => {
    const amount = 50;

    return request(app).put('/api/clients/topup').send({ amount }).expect(422);
  });
});

describe('Test the get customers api', () => {
  test('It should respond to the GET method', () => {
    return request(app)
      .get('/api/clients')
      .then((response) => {
        expect(response.statusCode).toBe(200);
      });
  });
});

describe('TEST POST order ', function () {
  test('responds with json', function (done) {
    request(app)
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

  describe('Test the orders path', () => {
    test('It should response GET api/orders', () => {
      return request(app)
        .get('/api/orders')
        .then((response) => {
          expect(response.statusCode).toBe(200);
        });
    });

    test('It should response GET api/orders/1', () => {
      return request(app)
        .get('/api/orders/1')
        .then((response) => {
          expect(response.statusCode).toBe(200);
        });
    });

    test('It should response POST api/orders/2/deliver', () => {
      return request(app)
        .post('/api/orders/2/deliver')
        .then((response) => {
          expect(response.statusCode).toBe(200);
        });
    });
  });

  describe('test client insertion' , ()=>{
    test('test post method to insert new client', ()=>{
      const client ={
        name:"saly",
        surname:"ashraf",
        phone:"123456789",
        mail:"saly@ashraf",
        address : "Milano",
        balance: "5",
        username:"salyAshraf",
        password:"salyAshraf"
      }
      return request(app)
          .post('/api/insert_client')
          .send(client)
          .expect(200);
    });

    test('test post method failure to insert new client due to wrong parameters', ()=>{
      const client ={}
      return request(app)
          .post('/api/insert_client')
          .send(client)
          .expect(500);
    });

  })


  describe('test user insertion' , ()=>{
    test('testing post method to insert a shop employee in the backend' , ()=>{
      const shop_employee = {
       typeUser:"shop_employee",
          name:"saly",
          surname:"ashraf",
          phone:"123456789",
          mail:"saly@ashraf",
          username:"salyAshraf",
          password:"salyAshraf"
      }
      return request(app)
          .post('/api/register_user')
          .send(shop_employee)
          .expect(200);
    })
  })

  test('test failure of post method due to missing parameters' , ()=>{
    return request(app)
        .post('/api/register_user')
        .send( {
          typeUser:"shop_employee",
        }) .then((response) => {
          expect(response.statusCode).toBe(500);
        });
  })

  test('test farmer insertion into backend with post method', ()=>{
    const farmer = {
      typeUser : 'farmer',
      name : 'Muhammad',
      surname: 'Ibrahim',
      mail: 'mohammad@ibrahim',
      phone : '123456789',
      address : 'Milano',
      farmName : 'paradise vegetables',
      username : 'muhammadibrahim',
      password : 'muhammadibrahim'
    }
    return request(app)
        .post('/api/register_user')
        .send(farmer)
        .expect(200)
  })

  test('test failure of post method due to missing parameters with farmer insertion' , ()=>{
    return request(app)
        .post('/api/register_user')
        .send( {
          typeUser:"farmer",
        }) .then((response) => {
          expect(response.statusCode).toBe(500);
        });
  })

});
