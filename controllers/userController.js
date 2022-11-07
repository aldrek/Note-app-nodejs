const express = require('express');
const mongoose = require('mongoose');
var userController = {};
const User = require('../models/user')
const Note = require('../models/note')

// return user info
userController.getUserInfo = (req, res) => {

    res.json({
        status : true,
        message : "Success",
        data : req.user
    })

};

// return the authenticated info 
userController.login = async (req, res) => {

    const { email, password } = req.body

    const user = await User.findOne({ email })

    //if user not exist than return status 400
    if (!user) return res.status(400).json({ error: "User not exist" })
    else {

        // Check password
        const check = await user.checkPassword(password)
        if (check) {

            // Generate token
            await user.generateAuthToken()
            res.send({
                data: user
            })

        } else {
            return res.status(400).json({ error: "Password not correct" })
        }

    }

};

// Create user info
// Todo : validate all fields then add image to user
userController.register = async (req, res) => {

    try {
        const user = new User(req.body)
        user.password = user.hashPassword()
        await user.save()

        if (user) {
            res.send({
                status: true,
                data: user
            })
        } else {
            res.status(500).send('Something went wrong')
        }
    } catch (err) {
        if (err instanceof mongoose.Error.ValidationError) {
            res.status(500).send(Object.values(err.errors).map(val => val.message))
        } else {
            res.status(500).send(err)
        }

    }


};

// Logout user by deleting token from user's data 
userController.logout = async (req, res) => {

    const userToken = req.token
   
    const newTokens = req.user.tokens.filter(t => t.token !== userToken)

    await User.findByIdAndUpdate(req.user._id, { tokens: newTokens })

    res.json({
        status: "true", message: "Logout completed"
    })

};

// Edit user by [id]
userController.editUser = async (req, res) => {

    const user = req.user 
    const newUser = await User.findByIdAndUpdate(user._id , {
        bio : req.body.bio , 
        fullname : req.body.fullname , 
    } , {new: true} )

    if(!newUser) res.json({
        status : false,
        message : "Something went wrong"
    })

    res.json({
        status : true,
        message : "Success",
        data : newUser
    })

};

// Delete user by [id]
userController.deleteUser = async (req, res) => {

    const user = req.user 
    const check = await User.findByIdAndRemove({_id : user._id})

    if(!check) res.json({
        status : false,
        message : "Something went wrong"
    })

    res.json({
        status : true,
        message : "Success"
    })

};


//////////// Admin //////////// 
// Admin edits any user by [id]
userController.editAnyUser = (req, res) => {
    res.send('Admin editAnyUser')
};

// return all users for admin 
userController.getAnyOrAllUsers = (req, res) => {
    res.send('Admin getAnyOrAllUsers')
};

// Admin deletes user
userController.deleteAnyUsers = (req, res) => {
    res.send('Admin deleteAnyUsers')
};

module.exports = userController;