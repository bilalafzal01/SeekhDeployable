"use strict";
module.exports = function(sequelize, DataTypes) {
    var enrolledCourse = sequelize.define("EnrolledCourses",{
        enrolledCourseID:  {
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
        courseID:   {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            references: {
                model: 'courses',
                key: 'course_id'
            }
        }        
    });
    return enrolledCourse;
};