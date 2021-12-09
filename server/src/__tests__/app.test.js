import request from 'supertest';
import app from '../app';
import { copyFileSync, unlinkSync } from 'fs';

/** During test the database can be modified, so we need to backup its state */

const dbPath = './database.db';
const backupPath = 'database.db.backup';

var session = require('supertest-session');
var testSession = session(app);

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
    var authenticatedSession;

    beforeEach(function (done) {
        testSession
            .post('/api/sessions')
            .send({username: 'pentolino', password: 'pentolino'})
            .end((err, response) => {
                if (err) return done(err);
                authenticatedSession = testSession;
                return done();
            });
    });


    test('It should respond to the GET method', () => {
        authenticatedSession
            .get('/api/products')
            .then((response) => {
                expect(response.statusCode).toBe(200);
            });
    });

/*
    afterEach(function (done) {
        authenticatedSession
            .delete('/api/sessions/current')
            .end((err, response) => {
                if (err) return done(err);
                return done();
            });
    });
*/


});


describe("Test the get farmer's products api", () => {
    var authenticatedSession;

    beforeEach(function (done) {
        testSession
            .post('/api/sessions')
            .send({username: 'pentolino', password: 'pentolino'})
            .end((err, response) => {
                if (err) return done(err);
                authenticatedSession = testSession;
                return done();
            });
    });

  test('It should respond 200 to the GET method', () => {
    return authenticatedSession
      .get('/api/farmer/3/products')
      .then((response) => {
        expect(response.statusCode).toBe(200);
      });
  });

  test('It should respond 404 to the GET method', () => {
    return authenticatedSession
      .get('/api/farmers/3/products')
      .then((response) => {
        expect(response.statusCode).toBe(404);
      });
  });

/*    afterEach(function (done) {
        authenticatedSession
            .delete('/api/sessions/current')
            .end((err, response) => {
                if (err) return done(err);
                return done();
            });
    });*/

});


describe('Test the get all the products supplied the next week linked by a farmer with {userId}', () => {
    var authenticatedSession;

    beforeEach(function (done) {
        testSession
            .post('/api/sessions')
            .send({username: 'pentolino', password: 'pentolino'})
            .end((err, response) => {
                if (err) return done(err);
                authenticatedSession = testSession;
                return done();
            });
    });

    test('It should respond 200 to the GET method', () => {
    return authenticatedSession
      .get('/api/farmer/3/products')
      .then((response) => {
        expect(response.statusCode).toBe(200);
      });
  });

  test('It should respond 404 to the GET method', () => {
    return request(app)
      .get('/api/farmer/3/products/supp')
      .then((response) => {
        expect(response.statusCode).toBe(404);
      });
  });
/*
    afterEach(function (done) {
        authenticatedSession
            .delete('/api/sessions/current')
            .end((err, response) => {
                if (err) return done(err);
                return done();
            });
    });*/

});

describe('Test the post for adding expected available product amounts for the next week', () => {
    var authenticatedSession;

    beforeEach(function (done) {
        testSession
            .post('/api/sessions')
            .send({username: 'pentolino', password: 'pentolino'})
            .end((err, response) => {
                if (err) return done(err);
                authenticatedSession = testSession;
                return done();
            });
    });


    test('It should respond 200 to the POST method', () => {
    const data = { productID: 4, quantity: 10, price: 10 };
    return authenticatedSession
      .post('/api/farmer/products/available')
      .send(data)
      .then((response) => {
        expect(response.statusCode).toBe(200);
      });
  });

  test('It should respond 404 to the POST method', () => {
    const data = { productID: 4, quantity: 10, price: 10 };
    return authenticatedSession
      .post('/api/farmers/product/available')
      .send(data)
      .then((response) => {
        expect(response.statusCode).toBe(404);
      });
  });
  test('It should respond 422 to the POST method', () => {
    const data = { productID: '4', price: 10 };
    return authenticatedSession
      .post('/api/farmer/products/available')
      .send(data)
      .then((response) => {
        expect(response.statusCode).toBe(422);
      });
  });
/*

    afterEach(function (done) {
        authenticatedSession
            .delete('/api/sessions/current')
            .end((err, response) => {
                if (err) return done(err);
                return done();
            });
    });
*/

});

describe('Test the delete for remove expected available product amounts for the next week', () => {
    var authenticatedSession;

    beforeEach(function (done) {
        testSession
            .post('/api/sessions')
            .send({username: 'pentolino', password: 'pentolino'})
            .end((err, response) => {
                if (err) return done(err);
                authenticatedSession = testSession;
                return done();
            });
    });

    test('It should respond 200 to the POST method', () => {
    const data = { productID: 4 };
    return authenticatedSession
      .delete('/api/farmer/products/available')
      .send(data)
      .then((response) => {
        expect(response.statusCode).toBe(200);
      });
  });

  test('It should respond 404 to the DELETE method', () => {
    const data = { productID: 4 };
    return authenticatedSession
      .delete('/api/farmers/product/available')
      .send(data)
      .then((response) => {
        expect(response.statusCode).toBe(404);
      });
  });
  test('It should respond 422 to the DELETE method', () => {
    const data = { productID: 'prod' };
    return authenticatedSession
      .delete('/api/farmer/products/available')
      .send(data)
      .then((response) => {
        expect(response.statusCode).toBe(422);
      });
  });

/*
    afterEach(function (done) {
        authenticatedSession
            .delete('/api/sessions/current')
            .end((err, response) => {
                if (err) return done(err);
                return done();
            });
    });
*/

});

describe('Test the get client orders api', () => {

    var authenticatedSession;

    beforeEach(function (done) {
        testSession
            .post('/api/sessions')
            .send({username: 'pentolino', password: 'pentolino'})
            .end((err, response) => {
                if (err) return done(err);
                authenticatedSession = testSession;
                return done();
              });
        });

    test('It should respond 200 to the GET method', () => {
        authenticatedSession
            .get('/api/clients/4/orders')
            .then((response) => {
                expect(response.statusCode).toBe(200);
            });
    });

    test('It should respond 404 to the GET method', () => {
        authenticatedSession
            .get('/api/clients//orders')
            .then((response) => {
                expect(response.statusCode).toBe(404);
            });
    });

    test('It should respond 200 to the GET method', () => {
        authenticatedSession
            .get('/api/clients/4/orders/2')
            .then((response) => {
                expect(response.statusCode).toBe(200);
            });
    });

    test('It should respond 404 to the GET method', () => {
        authenticatedSession
            .get('/api/clients//orders/2')
            .then((response) => {
                expect(response.statusCode).toBe(404);
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

    var authenticatedSession;

    beforeEach(function (done) {
        testSession
            .post('/api/sessions')
            .send({username: 'pentolino', password: 'pentolino'})
            .end((err, response) => {
                if (err) return done(err);
                authenticatedSession = testSession;
                return done();
              });
        });

    test('It should respond to the GET method', () => {
        authenticatedSession.get('/api/clients').then((response) => {
            expect(response.statusCode).toBe(200);
        });
    });

  test('It should respond to the PUT method', () => {
    const id = 1;
    const amount = 100;

        authenticatedSession.put('/api/clients/topup').send({amount, id}).then((response) => {
            expect(response.statusCode).toBe(200);
        });
    });

  test('it should fail to the PUT methoh (low amount)', () => {
    const id = 1;
    const amount = 3;

        authenticatedSession.put('/api/clients/topup').send({amount, id}).then((response) => {
            expect(response.statusCode).toBe(422);
        });
    });

  test('it should fail to the PUT methoh (missing parameter)', () => {
    const amount = 50;

        authenticatedSession.put('/api/clients/topup').send({amount}).then((response) => {
            expect(response.statusCode).toBe(422);
        });
    });
});
describe('Test the get customers api', () => {

    var authenticatedSession;

    beforeEach(function (done) {
        testSession
            .post('/api/sessions')
            .send({username: 'pentolino', password: 'pentolino'})
            .end((err, response) => {
                if (err) return done(err);
                authenticatedSession = testSession;
                return done();
              });
        });

    test('It should respond to the GET method', () => {
        authenticatedSession
            .get('/api/clients')
            .then((response) => {
                expect(response.statusCode).toBe(200);
            });
    });
});

describe('Test POST order ', function () {
    var authenticatedSession;

    beforeEach(function (done) {
        testSession
            .post('/api/sessions')
            .send({username: 'pentolino', password: 'pentolino'})
            .end((err, response) => {
                if (err) return done(err);
                authenticatedSession = testSession;
                return done();
            });
    });

    test('responds with json', function (done) {
        authenticatedSession
            .post('/api/orders')
            .send({clientID: 1, order: [{id: 55, quantity: 10.0}]})
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
});
// --- --- --- //

describe('Test the orders path', () => {

    var authenticatedSession;

    beforeEach(function (done) {
        testSession
            .post('/api/sessions')
            .send({username: 'pentolino', password: 'pentolino'})
            .end((err, response) => {
                if (err) return done(err);
                authenticatedSession = testSession;
                return done();
              });
        });

    test('It should response GET api/orders', () => {
        authenticatedSession
            .get('/api/orders')
            .then((response) => {
                expect(response.statusCode).toBe(200);
            });
    });

    test('It should response GET api/orders/1', () => {
        authenticatedSession
            .get('/api/orders/1')
            .then((response) => {
                expect(response.statusCode).toBe(200);
            });
    });
});

describe('Test the client path', () => {
    var authenticatedSession;

    beforeEach(function (done) {
        testSession
            .post('/api/sessions')
            .send({username: 'pentolino', password: 'pentolino'})
            .end((err, response) => {
                if (err) return done(err);
                authenticatedSession = testSession;
                return done();
            });
    });

    test('It should response GET api/client/4/basket', () => {
        return authenticatedSession
            .get('/api/client/4/basket')
            .then((response) => {
                expect(response.statusCode).toBe(200);
            });
    });
});

describe('Test add or delete a product into/from the basket', () => {
    var authenticatedSession;

    beforeEach(function (done) {
        testSession
            .post('/api/sessions')
            .send({username: 'pentolino', password: 'pentolino'})
            .end((err, response) => {
                if (err) return done(err);
                authenticatedSession = testSession;
                return done();
            });
    });

    test('Remove a product; It should response 200', () => {
        const data = {productId: 4};
        return authenticatedSession
            .delete('/api/client/4/basket/remove')
            .send(data)
            .then((response) => {
                expect(response.statusCode).toBe(200);
            });
    });
    test('Add a product; It should response 200', () => {
        const data = {productId: 4, reservedQuantity: 0.1};
        return authenticatedSession
            .post('/api/client/4/basket/add')
            .send(data)
            .then((response) => {
                expect(response.statusCode).toBe(200);
            });
    });


});

describe('Test failure add or delete a product into/from the basket', () => {
    var authenticatedSession;

    beforeEach(function (done) {
        testSession
            .post('/api/sessions')
            .send({username: 'pentolino', password: 'pentolino'})
            .end((err, response) => {
                if (err) return done(err);
                authenticatedSession = testSession;
                return done();
            });
    });

    test('Add a product; It should response 422 because validation fails', () => {
        const data = {productId: '', reservedQuantity: 0.1};
        return authenticatedSession
            .post('/api/client/4/basket/add')
            .send(data)
            .then((response) => {
                expect(response.statusCode).toBe(422);
            });
    });

    test('Remove a product; It should response 422 because validation fails', () => {
        const data = {productId: ''};
        return authenticatedSession
            .delete('/api/client/4/basket/remove')
            .send(data)
            .then((response) => {
                expect(response.statusCode).toBe(422);
            });
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
    return request(app).post('/api/register_user').send(shop_employee).expect(200);
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
    return request(app).post('/api/register_user').send(farmer).expect(200);
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
    var authenticatedSession;

    beforeEach(function (done) {
        testSession
            .post('/api/sessions')
            .send({username: 'pentolino', password: 'pentolino'})
            .end((err, response) => {
                if (err) return done(err);
                authenticatedSession = testSession;
                return done();
            });
    });

    test('Submit an order; It should response 200', () => {
        const userId = 2;
        return authenticatedSession.post(`/api/client/${userId}/basket/buy`).send().expect(200);
    });

    test('Submit an order; It should response 422', () => {
        const userId = 'ciao';
        return authenticatedSession.post(`/api/client/${userId}/basket/buy`).send().expect(422);
    });
});


describe('test adding new product description' ,()=>{
    var authenticatedSession;

    beforeEach(function (done) {
        testSession
            .post('/api/sessions')
            .send({username: 'pentolino', password: 'pentolino'})
            .end((err, response) => {
                if (err) return done(err);
                authenticatedSession = testSession;
                return done();
            });
    });

    test('test add successfully product description', ()=>{
        const productDescription ={
            name:'apple',
            description : 'new kind',
            category : 'fruit',
            unit: 'kg',
            ref_farmer : 3
        }
        authenticatedSession
            .post('/api/insert_product_description')
            .send(productDescription)
            .expect(200);
    })

    test('test add product description expect failure', ()=>{
        const productDescription ={}
        authenticatedSession
            .post('/api/insert_product-description')
            .send(productDescription)
            .expect(422);
    })

})
