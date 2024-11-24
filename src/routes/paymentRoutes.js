const express = require("express");
const {
  createPayment,
  getPaymentById,
  refundPayment,
} = require("../controllers/paymentController");

const router = express.Router();

router.post("/", createPayment);
router.get("/:id", getPaymentById);
router.post("/:id/refund", refundPayment);

module.exports = router;
