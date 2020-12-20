const sequelize = require("../db")
const Sequelize = require('sequelize')

const Comment = sequelize.define('comment', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    text: {
        type: Sequelize.STRING,
        allowNull: false
    },
    owner: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})

module.exports = Comment






// const {Schema, model, Types} = require("mongoose")
//
// const schema = Schema({
//     text: {type: String, required: true},
//     owner: {type:Types.ObjectId, ref: "User"}
// })
//
// module.exports = model("Comment", schema)