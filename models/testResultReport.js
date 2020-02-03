"use strict";
module.exports = function (sequelize, DataTypes) {
    var testResultReport = sequelize.define("TestResultReport", {
        testResultReportID: {
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
        subjectID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            references: {
                model: 'subjects',
                key: 'subjectID'
            }
        },
        chapterID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            references: {
                model: 'chapters',
                key: 'chapterID'
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
        numberOfQuestions: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 5
        },
        numberOfCorrectQuestions: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    });

    return testResultReport;
};