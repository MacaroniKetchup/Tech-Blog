const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');

// POST Model
class Post extends Model {}

Post.init(
    {
        // ID Column
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        // Title Column
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // Content Column
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // USER_ID Column
        user_id: {
            type: DataTypes.STRING,
            references: {
                model: 'user',
                key:'id',
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
        freezeTableName: true,
        underscored: true,
        timestamps: true,
        modelName: 'Post',
    }
);

module.exports = Post;