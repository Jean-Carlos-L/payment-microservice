const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config");

const sequelize = new Sequelize(config.database);

const Payment = sequelize.define("Payment", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "pending",
    validate: {
      isIn: [["pending", "completed", "refunded"]],
    },
  },
  payment_method: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customer_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  order_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
  indexes: [
    { fields: ["customer_id"] },
    { fields: ["order_id"] },
  ],
});

Payment.beforeUpdate((payment) => {
  if (payment.status === "refunded" && payment.previous("status") !== "completed") {
    throw new Error("Only completed payments can be refunded.");
  }
});

module.exports = { sequelize, Payment };