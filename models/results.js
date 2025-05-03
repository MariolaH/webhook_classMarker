// Purpose: Contains Sequelize model definitions — these define the structure of your tables in the database.
const { DataTypes } = require('sequelize')
// This imports your Sequelize instance (configured in db.js) to connect to your PostgreSQL database.
const sequelize = require('../config/db')

// The .define() method in Sequelize is used to define (i.e., create) a model, which represents a table in your database.
// .define() creates a Sequelize model that links your code to a real table in your PostgreSQL (or other SQL) database.
const Result = sequelize.define('Result', {
    studentId: {
      type: DataTypes.STRING,
      field: 'student_id',
    },
    classId: {
      type: DataTypes.STRING,
      field: 'class_id',
    },
    passed: {
      type: DataTypes.BOOLEAN,
    },
  }, {
    tableName: 'results',
    indexes: [
      {
        // Also includes a composite uniqueness constraint (no two rows can have the same student + class combination).
        unique: true,
        fields: ['studentId', 'classId'], // composite uniqueness
      },
    ],
  });

  
  module.exports = Result;