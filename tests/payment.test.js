const request = require("supertest");
const app = require("../src/server"); // Importar el objeto `app` de server.js

// Asegúrate de que el token sea válido para las pruebas
let token;
let paymentId;

beforeAll(async () => {
  // Inicia sesión para obtener el token
  const response = await request(app)
    .post("/auth/login")
    .send({
      username: "testuser",
      password: "testpassword",
    });

  token = response.body.token;
});

beforeEach(async () => {
  // Resetea la base de datos antes de cada prueba
  await request(app)
    .post("/auth/register")
    .send({
      username: "testuser",
      password: "testpassword",
    });
  const response = await request(app)
    .post("/payments")
    .set("Authorization", `Bearer ${token}`)
    .send({
      amount: 100.5,
      currency: "USD",
      payment_method: "card",
      customer_id: "1234",
      order_id: "5678",
    });
  paymentId = response.body.id; // Guarda el ID del pago
});

describe("Payments API", () => {
  it("should create a payment", async () => {
    const response = await request(app)
      .post("/payments")
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 100.5,
        currency: "USD",
        payment_method: "card",
        customer_id: "1234",
        order_id: "5678",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.amount).toBe(100.5);
    paymentId = response.body.id; // Guardar el ID para otros tests
  });

  it("should retrieve a payment by ID", async () => {
    const response = await request(app)
      .get(`/payments/${paymentId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", paymentId);
    expect(response.body).toHaveProperty("amount", 100.5);
  });

  it("should update payment status", async () => {
    const response = await request(app)
      .put(`/payments/${paymentId}/status`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "completed" });

    expect(response.status).toBe(200);
    // Verifica si el estado del pago es 'completed'
    expect(response.body).toHaveProperty("status", "completed");
    expect(response.body).toHaveProperty("id", paymentId);
  });

  it("should return 404 for non-existent payment", async () => {
    const response = await request(app)
      .get("/payments/9999")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Payment not found");
  });

  it("should return 401 for missing token", async () => {
    const response = await request(app)
      .get(`/payments/${paymentId}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Access denied");
  });
});
