const {Model, DataTypes, Sequelize} = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

// USER Model
class User extends Model {
    // PASSWORD Validation
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }
}
// Table Config
User.init(
    {
        // ID Column
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        // USERNAME Column
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // EMAIL Column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        // PASSWORD Column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [8],
            },
        },
    },
    {
        hooks: {
            beforeCreate: async (newUserData) => {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },
            beforeUpdate: async (updateUserData) => {
                newUserData.password = await bcrypt.hash(updateUserData.password, 10);
            },
        },
        // Table Config Options
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'user'
    }
);

module.exports = User;
