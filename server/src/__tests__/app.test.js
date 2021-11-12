import request from "supertest";
import app from "../app";

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

describe("Test the clients api", () => {
  test("It should respond to the GET method", () => {
    return request(app).get("/api/clients").expect(200);
  });

  test("It should respond to the PUT method", () => {
    const id = 1;
    const amount = 100;

    return request(app)
      .put(`/api/clients/${id}/topup`)
      .send({ amount })
      .expect(200);
  });

  test("it should fail to the PUT methoh (low amount)", () => {
    const id = 1;
    const amount = 3;

    return request(app)
      .put(`/api/clients/${id}/topup`)
      .send({ amount })
      .expect(422);
  });
});
