const sequelize = require("../db")
const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    friends: {
        type: DataTypes.ARRAY(DataTypes.INTEGER)
    },
    posts: {
        type: DataTypes.ARRAY(DataTypes.INTEGER)
    }
})

module.exports = User



// const {Schema, model, Types} = require('mongoose')
//
// const schema = Schema({
//     email: {type: String, required: true, unique: true},
//     password: {type: String, required: true},
//     username: {type: String, required: true, unique: true},
//     posts: [{type: Types.ObjectId, ref: 'Post'}],
//     friends: [{type: Types.ObjectId, ref: 'User'}]
// })
//
// module.exports = model('User', schema)