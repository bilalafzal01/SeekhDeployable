"use strict";
module.exports = function (sequelize, DataTypes) {
    var test = sequelize.define("Test", {
        testID: {
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
        courseID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'courses',
                key: 'course_id'
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
        subjectID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            references: {
                model: 'subjects',
                key: 'subjectID'
            }
        },
        mcqIDs: {
            type: DataTypes.STRING,
            defaultValue: null
        },
        currentMCQID: {
            type: DataTypes.STRING,
            defaultValue: null
        }
    });

    return test;
};