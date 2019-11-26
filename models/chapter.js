"use strict";
module.exports = function(sequelize, DataTypes) {
    var chapter = sequelize.define("Chapter",{
        chapterID:  {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        chapterName:  {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'chapterName'
        },
        subjectID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            references: {
                model: 'subjects',
                key: 'subjectID'
            }
        }
    });

    return chapter;
};