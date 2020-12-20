const express = require('express')
const path = require('path')
const sequelize = require('./db')
const PORT = process.env.PORT || 5000

const app = express()

app.use(express.json({extended: true}))

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/profile', require('./routes/profile.routes'))
app.use('/api/post', require('./routes/post.routes'))

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client/build/index.html'));
    });
}


async function startApp () {
    try{
        await sequelize.sync()
        app.listen(PORT, () => {
            console.log(`Server has been started on port ${PORT} ...`)
        })
    } catch (err) {
        console.log("Error", err.message)
        process.exit(1)
    }
}

startApp()