"use strict";
module.exports = function(sequelize, DataTypes) {
    var subject = sequelize.define("Subject",{
        subjectID:  {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        subjectName:  {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Math'
        },
        field:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Pre Engineering'
        }        
    });
    return subject;
};