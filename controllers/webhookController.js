const TestResult = require('../models/testResult');
const Result = require('../models/results')

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

    // this inserts a new row into the results table.
    await Result.create({
      studentId: result?.extra_info_answer,
      classId: result?.extra_info2_answer,
      passed: result?.passed,
    });    

    console.log('✅ Webhook data saved to database');
    res.status(200).send('Webhook received and saved');
  } catch (error) {
    console.error('❌ Error saving webhook data:', error);
    res.status(500).send('Server error');
  }
};

module.exports = { receiveWebhook };

