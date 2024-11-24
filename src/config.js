require("dotenv").config();

module.exports = {
  database: {
    dialect: "sqlite",
    storage: "./payments.db",
  },
};
