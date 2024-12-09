const { Payment } = require("../models/payment");

const createPayment = async (req, res) => {
  try {
    // Validación de los parámetros requeridos
    const { amount, currency, payment_method, customer_id, order_id } = req.body;

    if (!amount || !currency || !payment_method || !customer_id || !order_id) {
      return res.status(400).json({ message: "All fields are required: amount, currency, payment_method, customer_id, order_id" });
    }

    // Crear el pago
    const payment = await Payment.create(req.body);
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;  // Obtener el nuevo estado del cuerpo de la solicitud
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const payment = await Payment.findByPk(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Validar que el nuevo estado sea uno permitido
    const validStatuses = ["pending", "completed", "refunded"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status value. Valid values are: ${validStatuses.join(", ")}` });
    }

    // Si el estado es "completed", hacer validaciones adicionales
    if (status === "completed" && payment.status === "completed") {
      return res.status(400).json({ message: "This payment is already completed" });
    }

    // Actualizar el estado
    payment.status = status;
    await payment.save();

    res.json(payment);  // Devolver el pago actualizado
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const refundPayment = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    // Validar que el pago esté en estado "completed"
    if (payment.status !== "completed") {
      return res.status(400).json({ 
        message: `Cannot refund this payment. Current status: ${payment.status}` 
      });
    }

    // Verificar si ya fue reembolsado
    if (payment.status === "refunded") {
      return res.status(400).json({ message: "This payment has already been refunded" });
    }

    // Cambiar el estado a "refunded"
    payment.status = "refunded";
    await payment.save();

    res.json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createPayment, getPaymentById, updatePaymentStatus, refundPayment };
