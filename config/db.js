// Purpose: Sets up and connects Sequelize to your PostgreSQL database using credentials from the .env file.
const { Sequelize } = require("sequelize");

// Creates a connection to the database.
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
    timezone: process.env.TZ || "UTC",
  }
);

// Tests that the connection works.
sequelize
  .authenticate()
  .then(() => console.log("Database connected ✅"))
  .catch((err) => console.error("Database connection failed ❌:", err));

// Exports the database connection for use elsewhere.
module.exports = sequelize;
