"use strict";
module.exports = function(sequelize, DataTypes) {
    var test = sequelize.define("Test",{
        testID:  {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userID:  {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'mcq statement'
        },
        courseID:  {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'option 1'
        },
        chapterID:  {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            references: {
                model: 'chapters',
                key: 'chapterID'
            }
        },
        subjectID:  {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            references: {
                model: 'subjects',
                key: 'subjectID'
            }
        }
    }); 
 
    return test;
};