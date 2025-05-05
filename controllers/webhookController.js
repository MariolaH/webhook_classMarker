// Purpose: Handles incoming webhook requests (JSON payloads) and writes them to the database.
const TestResult = require("../models/testResult");
const Result = require("../models/results");
//In your webhook, you're using crypto to verify that the request actually came from ClassMarker and wasn’t tampered with.
const crypto = require("crypto"); // gives you access to cryptographic functions

const SECRET_PHRASE = process.env.CLASSMARKER_SECRET;

const receiveWebhook = async (req, res) => {
  try {
    // 🔐 Step 1: Verify the request signature
    const signature = req.get("X-Classmarker-Hmac-Sha256"); // get the signature from ClassMarker
    const hash = crypto
      .createHmac("sha256", SECRET_PHRASE)
      .update(req.rawBody) // raw body middleware is already in your server.js
      .digest("base64");

    console.log("ClassMarker Signature:", signature);
    console.log("Local Hash:", hash);

    if (signature !== hash) {
      console.error("❌ Invalid ClassMarker signature!");
      return res.status(401).send("Invalid signature");
    }

    console.log("✅ Verified webhook from ClassMarker!");
    // ✅ Signature valid — continue processing
    // Destructures req.body into its parts: payload_type, payload_status, test, link, and result
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

    // this inserts a new row into the results table.
    await Result.create({
      studentId: result?.extra_info_answer,
      classId: result?.extra_info2_answer,
      passed: result?.passed,
    });

    console.log("✅ Webhook data saved to database");
    res.status(200).send("Webhook received and saved");
  } catch (error) {
    console.error("❌ Error saving webhook data:", error);
    res.status(500).send("Server error");
  }
};

module.exports = { receiveWebhook };
