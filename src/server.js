const express = require("express");
const cors = require("cors");
const paymentRoutes = require("./routes/paymentRoutes");
const { sequelize } = require("./models/payment");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/payments", paymentRoutes);

module.exports = app;

// Iniciar el servidor solo si no está en entorno de prueba
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;
  sequelize.sync().then(() => {
    app.listen(PORT, () => {
      console.log(`Payments service running on http://localhost:${PORT}`);
    });
  });
}
