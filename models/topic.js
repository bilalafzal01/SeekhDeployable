"use strict";
module.exports = function(sequelize, DataTypes) {
    var topic = sequelize.define("Topic",{
        topicID:  {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        topicName:  {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'topicName'
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
        chapterID:  {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            references: {
                model: 'chapters',
                key: 'chapterID'
            }
        }
    });
    return topic;
};