const express = require('express');
var userController = {};
const auth = require('../middleware/auth')

// return user info
userController.getUserInfo = (req, res) => {
    res.send('getUserInfo')
};

// return the authenticated info 
userController.login = (req, res) => {
    res.send('login')
};

// Create user info
userController.register = (req, res) => {
    res.send('register')
};

// Edit user by [id]
userController.editUser = (req, res) => {
    res.send('editUser')
};

// Delete user by [id]
userController.deleteUser = (req, res) => {
    res.send('deleteUser')
};

userController.logout = (req, res) => {
    res.send('logout')
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