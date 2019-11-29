"use strict";
module.exports = function(sequelize, DataTypes) {
    var courseSubject = sequelize.define("CourseSubject",{
        courseSubjectID:  {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        subjectID:  {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            references: {
                model: 'subjects',
                key: 'subjectID'
            }
        },
        courseID:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            references: {
                model: 'courses',
                key: 'course_id'
            }
        }
    });
    return courseSubject;
};