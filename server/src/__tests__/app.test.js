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
