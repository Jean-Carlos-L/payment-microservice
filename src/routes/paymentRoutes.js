const express = require("express");
const {
  createPayment,
  getPaymentById,
  refundPayment,
  updatePaymentStatus,
} = require("../controllers/paymentController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticateToken, createPayment);
router.get("/:id", authenticateToken, getPaymentById);
router.post("/:id/refund", authenticateToken, refundPayment);
router.put("/:id/status", authenticateToken, updatePaymentStatus);

module.exports = router;
