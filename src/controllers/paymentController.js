const { Payment } = require("../models/payment");

const createPayment = async (req, res) => {
  try {
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

const refundPayment = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    if (payment.status !== "completed")
      return res.status(400).json({ message: "Cannot refund this payment" });

    payment.status = "refunded";
    await payment.save();

    res.json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createPayment, getPaymentById, refundPayment };
