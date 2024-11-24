const request = require("supertest");
const app = require("../src/server"); // Importar el objeto `app` de server.js

describe("Payments API", () => {
  it("should create a payment", async () => {
    const response = await request(app).post("/payments").send({
      amount: 100.5,
      currency: "USD",
      payment_method: "card",
      customer_id: "1234",
      order_id: "5678",
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });
});
