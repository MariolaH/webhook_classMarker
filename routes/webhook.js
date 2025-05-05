// Purpose: Defines the actual URL route (/webhook) and links it to the controller function
console.log("🔔 Webhook received!");
const express = require("express");
const router = express.Router();
const { receiveWebhook } = require("../controllers/webhookController");

router.post("/", receiveWebhook);

module.exports = router;
