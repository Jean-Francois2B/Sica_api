const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

//Mofifier un utilisateur

router.put("/:id", async (req, res) => {
    if (req.body.userId == req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                res.body.password = await bcrypt.hash(req.body.password, salt);
            }
            catch (err) {
                return res.status(500).json(err);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("Your account have been updated")
        }
        catch (err) {
            return res.status(500).json(err);
        }
    }
    else {
        return req.status(403).json("You can only update your account");
    }
})

//Supprimer un utilisateur

router.delete("/:id", async (req, res) => {
    if (req.body.userId == req.params.id || req.body.isAdmin) {

        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Your account has been deleted")
        }
        catch (err) {
            return res.status(500).json(err);
        }
    }
    else {
        return res.status(403).json("You can delete only your account");
    }
})

//Avoir un utilisateur

router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, updatedAt, ...other } = user._doc
        res.status(200).json(other);
    }
    catch (err) {
        return res.status(500).json(err);
    }
})

//Suivre un utilisateur

router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({$push:{followers: req.body.userId}});
                await currentUser.updateOne({$push:{following: req.params.id}});
                res.status(200).json("User has been followed");
            }
            else{
                res.status(403).json("You already follow this user")
            }
        }
        catch (err) {
            return res.status(500).json(err);
        }

    }
    else {
        res.status(403).json("You can't follow yourself");
    }
})

//Ne plus suivre un utilisateur

router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({$pull:{followers: req.body.userId}});
                await currentUser.updateOne({$pull:{following: req.params.id}});
                res.status(200).json("User has been unfollowed");
            }
            else{
                res.status(403).json("You don't follow this user")
            }
        }
        catch (err) {
            return res.status(500).json(err);
        }

    }
    else {
        res.status(403).json("You can't unfollow yourself");
    }
})

module.exports = router