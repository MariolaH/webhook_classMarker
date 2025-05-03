require("dotenv").config();
const TestResult = require("./models/testResult");
const Result = require("./models/results");
const express = require("express");
const bodyParser = require("body-parser");
const webhookRoutes = require("./routes/webhook");
const sequelize = require("./config/db"); // makes sure db connects at startup

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/webhook", webhookRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

sequelize
  .sync({ alter: true }) // creates the table if it doesn't exist
  .then(() => console.log("Models synced 🗂️"))
  .catch((err) => console.error("Model sync failed:", err));
