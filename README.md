✅ GOAL

    Create a webhook endpoint, receive JSON data, and store it in your database.

🧱 TECH STACK

    Node.js
    Express.js (handles web server/routes)
    Sequelize (ORM for interacting with PostgreSQL)
    PostgreSQL (your database)
    dotenv (manages credentials/environment variables)

📌 STEP-BY-STEP INSTRUCTIONS

1. Create your project
    mkdir name_of_project && cd name_of_project
    npm init -y

2. Install required packages

    npm install express sequelize pg pg-hstore body-parser dotenv
    npm install --save-dev nodemon

3. Project structure

Create this folder structure:

    webhook_receiver/
    │
    ├── config/
    │   └── db.js
    ├── controllers/
    │   └── webhookController.js
    ├── models/
    │   ├── testResult.js
    │   └── results.js
    ├── routes/
    │   └── webhook.js
    ├── .env
    ├── server.js

4. Configure .env file

    PORT=3000
    DB_USER=*******
    DB_PASSWORD=*******
    DB_NAME=*******
    DB_HOST=*******
    DB_PORT=5432
    TZ=America/New_York

5. Set up database connection

config/db.js

    const { Sequelize } = require("sequelize");

    const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
        logging: false,
        timezone: process.env.TZ || "UTC"
    }
    );

    sequelize
    .authenticate()
    .then(() => console.log("Database connected ✅"))
    .catch((err) => console.error("Database connection failed ❌:", err));

    module.exports = sequelize;

6. Define models (table structure)

models/testResult.js

    const { DataTypes } = require("sequelize");
    const sequelize = require("../config/db");

    const TestResult = sequelize.define("TestResult", {
    payloadType: DataTypes.STRING,
    payloadStatus: DataTypes.STRING,
    testId: DataTypes.BIGINT,
    testName: DataTypes.STRING,
    linkId: DataTypes.BIGINT,
    linkName: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    percentage: DataTypes.FLOAT,
    pointsScored: DataTypes.FLOAT,
    pointsAvailable: DataTypes.FLOAT,
    passed: DataTypes.BOOLEAN,
    extraInfo1: DataTypes.STRING,
    extraInfo2: DataTypes.STRING,
    ipAddress: DataTypes.STRING
    }, {
    tableName: "test_results"
    });

    module.exports = TestResult;

models/results.js
To store just a simplified record:

    const { DataTypes } = require("sequelize");
    const sequelize = require("../config/db");

    const Result = sequelize.define("Result", {
    studentId: {
        type: DataTypes.STRING,
        field: 'student_id',
    },
    classId: {
        type: DataTypes.STRING,
        field: 'class_id',
    },
    passed: DataTypes.BOOLEAN
    }, {
    tableName: "results",
    indexes: [
        {
        unique: true,
        fields: ['studentId', 'classId']
        }
    ]
    });

    module.exports = Result;

7. Write controller logic
controllers/webhookController.js

    const TestResult = require('../models/testResult');
    const Result = require('../models/results');

    const receiveWebhook = async (req, res) => {
    try {
        const { payload_type, payload_status, test, link, result } = req.body;

        await TestResult.create({
        payloadType: payload_type,
        payloadStatus: payload_status,
        testId: test?.test_id,
        testName: test?.test_name,
        linkId: link?.link_id,
        linkName: link?.link_name,
        firstName: result?.first,
        lastName: result?.last,
        email: result?.email,
        percentage: result?.percentage,
        pointsScored: result?.points_scored,
        pointsAvailable: result?.points_available,
        passed: result?.passed,
        extraInfo1: result?.extra_info_answer,
        extraInfo2: result?.extra_info2_answer,
        ipAddress: result?.ip_address,
        });

        await Result.create({
        studentId: result?.extra_info_answer,
        classId: result?.extra_info2_answer,
        passed: result?.passed
        });

        console.log("✅ Webhook data saved to database");
        res.status(200).send("Webhook received and saved");
    } catch (error) {
        console.error("❌ Error saving webhook data:", error);
        res.status(500).send("Server error");
    }
    };

    module.exports = { receiveWebhook };

8. Create the webhook route
routes/webhook.js

    const express = require("express");
    const router = express.Router();
    const { receiveWebhook } = require("../controllers/webhookController");

    router.post("/", receiveWebhook);

    module.exports = router;

9. Build the server
server.js

    require("dotenv").config();
    const express = require("express");
    const bodyParser = require("body-parser");
    const webhookRoutes = require("./routes/webhook");
    const sequelize = require("./config/db");
    const TestResult = require("./models/testResult");
    const Result = require("./models/results");

    const app = express();
    const PORT = process.env.PORT || 3000;

    app.use(bodyParser.json());
    app.use("/webhook", webhookRoutes);

    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });

    sequelize.sync({ alter: true })  // creates/updates tables
    .then(() => console.log("Models synced 🗂️"))
    .catch((err) => console.error("Model sync failed:", err));

10. Run the server
npm run dev 

Database connected ✅
Server is running on port 3000
Models synced 🗂️

node server.js

    Runs your app one time.
    If your code changes, it won’t reload — you have to stop the server and re-run it.
    Used in production or simple testing.

nodemon server.js

    Runs your app like node, but automatically restarts the server when any files change.
    Used in development — makes it fast to test changes.
    Then you can make changes to server.js, routes, or controllers, and it will restart on its own.

This system will:

    Receive JSON data via webhook
    Save it into two separate tables (test_results and results)
    Keep the schema updated with sync({ alter: true })
    Run easily with nodemon during development