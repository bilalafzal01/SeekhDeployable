"use strict";

module.exports = function(sequelize, DataTypes){
    var correctMCQ = sequelize.define("CorrectMCQ",{
        correctMCQID:  {
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
        attempted: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        correct: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        }
    });
    
    return correctMCQ;
};