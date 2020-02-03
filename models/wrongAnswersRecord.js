"use strict";
module.exports = function (sequelize, DataTypes) {
    var wrongAnswer = sequelize.define("WrongAnswer", {
        wrongAnswerID: {
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
            defaultValue: "defaultAns"
        }
    });

    return wrongAnswer;
};