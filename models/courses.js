"use strict";
module.exports = function(sequelize, DataTypes) {
    var Courses = sequelize.define("Courses",{
        course_id:  {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title:  {
            type: DataTypes.STRING,
            allowNull: false
        },
        fullForm:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'NUST Entry Test'
        },
        meritCriteriaMatric:  {
            type: DataTypes.INTEGER
        },
        meritCriteriaFSC:  {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        meritCriteriaTest:  {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        description:    {
            type: DataTypes.STRING,
            allowNull: false
        },
        field:  {
            type: DataTypes.STRING,
            allowNull: false, 
            defaultValue: "Pre Engineering"
        }        
    });
    return Courses;
};