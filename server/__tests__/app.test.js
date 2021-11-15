import request from "supertest";
import app from "../src/app";

describe("Test the root path", () => {
  test("It should response the GET method", () => {
    return request(app)
      .get("/")
      .then((response) => {
        expect(response.statusCode).toBe(200);
      });
  });
});

describe("Test the orders path", () => {
  test("It should response GET api/orders", () => {
    return request(app)
      .get("/api/orders")
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

  test("It should response GET api/orders/11231", () => {
    return request(app)
      .get("/api/orders/11231")
      .then((response) => {
        expect(response.statusCode).toBe(200);
      });
  });

});
