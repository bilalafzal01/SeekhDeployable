"use strict";

module.exports = function(sequelize, DataTypes){
    var attemptedMCQ = sequelize.define("AttemptedMCQ",{
        attemptedMCQID:  {
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
    
    return attemptedMCQ;
};