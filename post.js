const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

// Créer une publication

router.post("/", async (req,res) => {
    const newPost = Post(req.body);
    try{
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    }
    catch(err){
        return res.status(500).json(err);
    }
})

// Mofifier une publication

router.put("/:id", async (req,res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.updateOne({$set:req.body});
            res.status(200).json("Your post has been updated");
        }
        else{
            res.status(403).json("you can update only your post");
        }
    }
    catch(err) {
        return res.status(500).json(err);
    }
} )

// Supprimer une publication

router.delete("/:id", async (req,res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.deleteOne({$set:req.body});
            res.status(200).json("Your post has been deleted");
        }
        else{
            res.status(403).json("you can delete only your post");
        }
    }
    catch(err) {
        return res.status(500).json(err);
    }
} )

// Voir une publication

router.get("/:id", async (req,res) => {
    try{
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    }
    catch(err){
        return res.status(500).json(err);
    }
})


// Voir les publications classées par échelle temps

router.get("/timeline/:userId", async (req,res) => {
    try{
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({userId : currentUser._id});
        const friendPosts = await Promise.all(
            currentUser.following.map((friendId) => {
                return Post.find({userId : friendId});
            })
        );
        res.status(200).json(userPosts.concat(...friendPosts));
    }
    
    catch(err){
        return res.status(500).json(err);
    }
})

module.exports = router