"use strict";
module.exports = function(sequelize, DataTypes) {
    var mcq = sequelize.define("MCQ",{
        mcqID:  {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        statement:  {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'mcq statement'
        },
        option1:  {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'option 1'
        },
        option2:  {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'option 2'
        },
        option3:  {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'option 3'
        },
        option4:  {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'option 4'
        },
        correctAns: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'correct Ans'
        },
        topicID:    {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            references: {
                model: 'topics',
                key: 'topicID'
            }
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
        },
        mcqNumber:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        }
    }); 
 
    return mcq;
};