const {Router} = require('express')
const router = Router()
const User = require("../models/User")
const Post = require('../models/Post')
const auth = require('../middleware/auth.middleware')

router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.userId, {raw: true})

        if (!user) {return res.status(400).json({message: "Data error, no user with this id"})}

        const data = {
            username: user.username,
            friends: user.friends,
            posts: user.posts
        }
        res.json({user: data})
    } catch (err) {
      res.status(400).json({message: "Something go wrong, try again"})
    }
})

router.get('/users', auth, async (req, res) => {
    try{
        const users = await User.findAll()
        res.json({users: users})
    } catch (err){
        res.status(400).json({message: "Something go wrong, try again"})
    }
})

router.get('/news' , auth, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.userId, {raw: true})
        if (!user.friends) user.friends = []

        let postsData = {postsDataArray: []}

        // for (let i=0; i<user.friends.length; i++){
        //     let friend = await User.findByPk(user.friends[i], {raw: true})
        //     for(let j=0; j<friend.posts.length; j++){
        //         let post = await Post.findByPk(friend.posts[j], {raw: true})
        //         postsData.postsDataArray.push(post)
        //     }
        // }

        const posts = await Post.findAll()
        if (!posts) return res.status(400).json({message: "No posts"})
        for (let i=0; i<posts.length; i++){
            if(user.friends.includes(Number.parseInt(posts[i].owner)) || posts[i].owner == req.user.userId){
                postsData.postsDataArray.push(posts[i])
            }
        }
        postsData.postsDataArray.reverse()
        res.json({postsData: postsData})
    } catch (err) {
        res.status(400).json({err: err.message, message: "Something go wrong, try again"})
    }
})

router.get("/:id", auth, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {raw: true})

        if (!user) {return res.status(400).json({message: "Data error, no user with this id"})}

        const data = {
            id: user.id,
            username: user.username,
            friends: user.friends,
            posts: user.posts
        }
        res.json({user: data})
    } catch (err) {
        res.status(400).json({message: "Something go wrong, try again"})
    }
})

router.get('/follow/:followUserId', auth, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.userId, {raw: true})
        let friends = user.friends
        if (!friends) friends = []

        if(! User.findByPk(req.params.followUserId)){
            return res.status(400).json({message: "Data error, no user with this id"})
        }

        if (friends.includes(req.params.followUserId)) {
            return res.status(400).json({message: "User with this id already exist"})
        }

        await User.findByPk(req.user.userId, {raw: true}).then(async result => {
            if (!result.friends) result.friends = []
            result.friends.push(req.params.followUserId)
            await User.update({friends: result.friends}, {where: {id: req.user.userId}})
        })

        // await User.findByIdAndUpdate(req.user.userId,
        //     {$addToSet: {friends: req.params.followUserId}})
        res.json({message: "Success following"})
    } catch (err){
        console.log(err.message)
        res.status(400).json({message: "Something go wrong, try again"})
    }
})

router.get('/unfollow/:unfollowUserId', auth, async (req, res) => {
    try{
        const user = await User.findByPk(req.user.userId, {raw: true})
        let friends = user.friends

        if(! User.findByPk(req.params.unfollowUserId, {raw: true})){
            return res.status(400).json({message: "Data error, no user with this id"})
        }

        if (!friends.includes(Number.parseInt(req.params.unfollowUserId))) {
            return res.status(400).json({message: "No friend with this id"})
        }

        const index = friends.indexOf(req.params.unfollowUserId)
        friends.splice(index, 1)

        await User.update({friends: friends}, {where: {id: req.user.userId}})
        // await User.findByIdAndUpdate(req.user.userId, {friends: friends})
        res.json({message: "Success unfollowing"})
    } catch (err) {
        res.status(400).json({message: "Something go wrong, try again"})
    }
})

module.exports = router