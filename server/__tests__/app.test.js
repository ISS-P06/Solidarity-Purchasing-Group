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
});