require("dotenv").config();
console.log("Using DB:", process.env.DB_NAME);
const TestResult = require("./models/testResult");
const Result = require("./models/results");
const express = require("express");
const bodyParser = require("body-parser");
const webhookRoutes = require("./routes/webhook");
const sequelize = require("./config/db"); // makes sure db connects at startup
const getRawBody = require("raw-body");

// Purpose: Starts your Express app and syncs the Sequelize models.

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  getRawBody(
    req,
    {
      length: req.headers["content-length"],
      limit: "1mb",
      encoding: true,
    },
    (err, string) => {
      if (err) return next(err);
      req.rawBody = string;
      try {
        req.body = JSON.parse(string);
      } catch (e) {
        req.body = {};
      }
      next();
    }
  );
});

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

// Key pieces:
// Loads environment variables.
// Sets up Express and JSON middleware.
// Connects route /webhook to your handler.
// Starts listening on port 3000.
// Runs .sync({ alter: true }) to make sure tables are created or updated in the DB.

// 🧠 How it All Works Together:
// You start the server with node server.js (or nodemon).
// The app connects to your database.
// It listens on /webhook for POST requests.
// When a webhook is received, your controller:
// Extracts the JSON data.
// Saves one row in the test_results table (full detail).
// Saves another row in the results table (student/class/pass only).
