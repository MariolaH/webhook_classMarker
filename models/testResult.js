// Purpose: Contains Sequelize model definitions — these define the structure of your tables in the database.
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const TestResult = sequelize.define(
  "TestResult",
  {
    payloadType: {
      type: DataTypes.STRING,
    },
    payloadStatus: {
      type: DataTypes.STRING,
    },
    testId: {
      type: DataTypes.BIGINT,
    },
    testName: {
      type: DataTypes.STRING,
    },
    linkId: {
      type: DataTypes.BIGINT,
    },
    linkName: {
      type: DataTypes.STRING,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    percentage: {
      type: DataTypes.FLOAT,
    },
    pointsScored: {
      type: DataTypes.FLOAT,
    },
    pointsAvailable: {
      type: DataTypes.FLOAT,
    },
    passed: {
      type: DataTypes.BOOLEAN,
    },
    extraInfo1: {
      type: DataTypes.STRING,
    },
    extraInfo2: {
      type: DataTypes.STRING,
    },
    ipAddress: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "test_results",
    timestamps: true,
  }
);

module.exports = TestResult;
