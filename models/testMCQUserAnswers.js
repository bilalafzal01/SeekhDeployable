"use strict";
module.exports = function (sequelize, DataTypes) {
    var testMCQUserAnswer = sequelize.define("TestMCQUserAnswer", {
        testMCQUserAnswerID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        testID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            references: {
                model: 'tests',
                key: 'testID'
            }
        },
        mcqID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            references: {
                model: 'mcqs',
                key: 'mcqID'
            }
        },
        userAnswer: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "defaultAnswer"
        }
    });

    return testMCQUserAnswer;
};