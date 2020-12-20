const {Router} = require('express')
const router = Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const config = require('config')
const User = require('../models/User')

router.post('/registration',
    [
        check('email', 'Invalid email').isEmail(),
        check('password', 'Minimum length of password is 4 symbols').isLength({min: 4})
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()){
                return res.status(400).json({
                    message: "Invalid register data",
                    err: errors.array()
                })
            }

            const {email, password, username} = req.body

            // const user = await User.findOne({email})
            //
            // if(user){
            //     return res.status(400).json({message: "User already exists"})
            // }

            if (await User.findOne({where: {email: email}})) {
                res.status(400). json({message: "User with this email already exists"})
            }
            if (await User.findOne({where: {username: username}})) {
                res.status(400). json({message: "User with such username already exists"})
            }

            const hashedPassword = await bcrypt.hash(password, 12)

            await User.create({email, password: hashedPassword, username}).then(result => {
                const token = jwt.sign(
                    {userId: result.id},
                    config.get('jwtSecretKey'),
                    {expiresIn: "96h"}
                )
                res.status(201).json({token: token, userId: result.id})
            })
        } catch (err) {
            res.status(400).json({message: "Something go wrong, try again", err: err.message})
        }
    })

router.post('/login',
    [
        check('email', 'Invalid email').normalizeEmail().isEmail(),
        check('password', 'Incorrect password').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()){
                return res.status(400).json({
                    message: "Invalid login data",
                    err: errors.array()
                })
            }

            const {email, password} = req.body
            // const user = await User.findOne({email})
            const user = await User.findOne({raw: true, where: {email: email}})
            if (! user){
                return res.status(400).json({message: "Something go wrong, try again"})
            }

            const isCorrectPassword = await bcrypt.compare(password, user.password)
            if (!isCorrectPassword){
                return res.status(400).json({message: "Something go wrong, try again"})
            }

            const token = jwt.sign(
                {userId: user.id},
                config.get('jwtSecretKey'),
                {expiresIn: "96h"}
            )

            res.status(201).json({token, userId: user.id})
        } catch (err) {
            res.status(400).json({message: "Something go wrong, try again", err: err.message})
        }
    })

module.exports = router