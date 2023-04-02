const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');

// COMMENT Model
class Comment extends Model {}

Comment.init(
    {
        // ID Column
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        // Content Column
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        // USER_ID Column
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            },
        },
        // POST_ID Column
        post_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'post',
                key: 'id',
            },
        },
        // CREATED_AT Column
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        // TABLE Config Options
        sequelize,
        timestamps: true,
        freezeTableName: true,
        underscored: true,
        modelName: 'Comment',
    }
);

module.exports = Comment;