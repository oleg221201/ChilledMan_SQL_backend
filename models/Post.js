const sequelize = require("../db")
const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes


const Post = sequelize.define('post', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    text: {
        type: Sequelize.STRING,
        allowNull:false
    },
    owner: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    likes: {
        type: DataTypes.ARRAY(DataTypes.INTEGER)
    },
    comments: {
        type: DataTypes.ARRAY(DataTypes.INTEGER)
    }
})

module.exports = Post






// const {Schema, model, Types} = require('mongoose')
//
// const schema = Schema({
//     text: {type: String, required: true},
//     owner: {type: Types.ObjectId, ref: "User", required: true},
//     likes: [{type: Types.ObjectId, ref: "User"}],
//     comments: [{type: Types.ObjectId, ref: "Comment"}]
// })
//
// module.exports = model('Post', schema)