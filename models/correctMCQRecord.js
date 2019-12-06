"use strict";

module.exports = function(sequelize, DataTypes){
    var correctMCQRecord = sequelize.define("CorrectMCQRecord",{
        correctMCQRecordID:  {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userID:     {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            references: {
                model: 'users',
                key: 'id'
            }   
        },
        mcqID:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            references: {
                model: 'mcqs',
                key: 'mcqID'
            }   
        }
    });
    
    return correctMCQRecord;
};