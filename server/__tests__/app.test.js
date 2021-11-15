import request from "supertest";
import app from "../src/app";

describe("Test the root path", () => {
  test("It should respond to the GET method", () => {
    return request(app)
      .get("/")
      .then((response) => {
        expect(response.statusCode).toBe(200);
      });
  });
});

describe("Test the get products api", () => {
  test("It should respond to the GET method", () => {
    return request(app)
      .get("/api/products")
      .then((response) => {
        expect(response.statusCode).toBe(200);
      });
  });

  test("It should response GET api/orders/1", () => {
    return request(app)
      .get("/api/orders/1")
      .then((response) => {
        expect(response.statusCode).toBe(200);
      });
  });
  
});

  
describe("Test the orders path", () => {
  test("It should response GET api/orders", () => {
    return request(app)
      .get("/api/orders")
      
});

describe('Test the login APIs', () => {
  test('It should respond to the POST method', () => {
    const user = {username: "pentolino", password: "pentolino"};
    return request(app).post('/api/sessions').send(user).expect(200);
  });

  test('The POST method should fail', () => {
    const user = {username: "pentolino", password: "a"}
    return request(app).post('/api/sessions').send(user).expect(401);
  });

  test('It should respond to the DELETE method', () => {
    return request(app).delete('/api/sessions/current').expect(200);
  });
});

  
