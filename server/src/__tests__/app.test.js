import request from 'supertest';
import app from '../app';

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

describe('Test the clients api', () => {
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
