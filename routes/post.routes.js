const {Router} = require('express')
const router = Router()
const User = require('../models/User')
const Post = require('../models/Post')
const Comment = require('../models/Comment')
const auth = require('../middleware/auth.middleware')

router.get('/:id', async (req, res) => {
    try{
        const post = await Post.findByPk(req.params.id, {raw: true})
        if (! post) {
            return res.status(400).json({message: "No post with this id"})
        }
        res.json({post: post})
    } catch (err) {
      res.status(400).json({message: "Something go wrong, try again"})
    }
})

router.get('/comment/:id', async (req, res) => {
    try{
        const comment = await Comment.findByPk(req.params.id, {raw: true})
        if (! comment) {
            return res.status(400).json({message: "No comment with this id"})
        }
        res.json({comment: comment})
    } catch (err) {
        res.status(400).json({message: "Something go wrong, try again"})
    }
})

router.post('', auth, async (req, res) => {
    try{
        const post = {
            text: req.body.text,
            owner: req.user.userId
        }

        console.log(req.body.text)

        await Post.create(post).then(async result => {
            await User.findByPk(req.user.userId, {raw: true}).then(async user => {
                if (!user.posts) user.posts = []
                user.posts.push(result.id)
                await User.update({posts: user.posts}, {where: {id: req.user.userId}})
                res.json({postId: result.id, message: "Post created successfully"})
            })
        })
    } catch (err) {
        res.status(400).json({message: "Something go wrong, try again"})
    }
})

router.put('', auth, async (req, res) => {
    try {
        let loading = false
        const post = await Post.findByPk(req.body.postId, {raw: true})

        if (!post){
            return res.status(400).json({message: "Something go wrong, try again"})
        }

        if (!post.comments) post.comments = []
        if (!post.likes) post.likes = []

        if (req.body.text && req.user.userId.toString() === post.owner.toString()){
            await Post.update({text: req.body.text}, {where: {id: req.body.postId}})

            // await Post.findByIdAndUpdate(req.body.postId,
            //     {text: req.body.text})
            loading = true
        }

        if (req.body.comment){
            const comment = await Comment.create({text: req.body.comment, owner: req.user.userId})
            post.comments.push(comment.id)
            await Post.update({comments: post.comments}, {where: {id: req.body.postId}})

            // await Post.findByIdAndUpdate(req.body.postId,
            //     {$addToSet: {comments: comment.id}})
            loading = true
        }

        if (req.body.like){
            if (post.likes.includes(req.body.like)){
                const index = post.likes.indexOf(Number.parseInt(req.body.like))
                post.likes.splice(index, 1)
                //await Post.findByIdAndUpdate(req.body.postId, {likes: post.likes})
                await Post.update({likes: post.likes}, {where: {id: req.body.postId}})
            }
            else {
                post.likes.push(req.body.like)
                await Post.update({likes: post.likes}, {where: {id: req.body.postId}})

                // await Post.findByIdAndUpdate(req.body.postId,
                //     {$addToSet: {likes: req.body.like}})
            }
            loading = true
        }

        if (loading) res.json({message: "Post updated successfully"})
        else res.json({message: "Error, no suitable params"})
    } catch (err) {
        res.status(400).json({message: "Something go wrong, try again"})
    }
})

router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id, {raw: true})
        if (post.comments) {
            post.comments.forEach(async (comment) => {
                await Comment.destroy({where: {id: comment}})
            })
        }

        const user = await User.findByPk(req.user.userId, {raw: true})
        let posts = user.posts
        let index
        for (let i=0; i<posts.length; i++) {
            if(req.params.id == posts[i]) {
                index = i
                break
            }
        }
        posts.splice(index, 1)
        await User.update({posts: posts}, {where: {id: req.user.userId}})
        await Post.destroy({where: {id: req.params.id}})
        res.json({message: "Post deleted successfully"})
    } catch (err) {
        console.log(err.message)
        res.status(400).json({message: "Something go wrong, try again"})
    }
})

module.exports = router