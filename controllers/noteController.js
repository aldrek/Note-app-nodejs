const express = require('express');
var userController = {};

// return the note info 
userController.getNotesInfo = (req, res) => {
    res.send('getNotesInfo')
};

// return the user info 
userController.createNote = (req, res) => {
    res.send('createNote')
};

// Edit note info
userController.editNote = (req, res) => {
    res.send('editNote')
};

// Delete note by [id]
userController.deleteNote = (req, res) => {
    res.send('deleteNote')
};


//////////// Admin //////////// 
// Admin edits any user
userController.editAnyNote = (req, res) => {
    res.send('Admin editAnyNote')
};

// return all notes for admin 
userController.getAnyOrAllNotes = (req, res) => {
    res.send('Admin getAnyOrAllNotes')
};

// Admin deletes note
userController.deleteAnyNote = (req, res) => {
    res.send('Admin deleteAnyNote')
};

module.exports = userController
