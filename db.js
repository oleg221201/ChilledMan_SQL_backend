const Sequelize = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL)
//const sequelize = new Sequelize("postgres://omfjlgpj:rWeXIIRN6DWacmyAp3hRUM3JxNAgPmSV@hattie.db.elephantsql.com:5432/omfjlgpj")

// const sequelize = new Sequelize("chilledman", "oleg", "123456", {
//     host: 'localhost',
//     dialect: 'postgres'
// })

module.exports = sequelize