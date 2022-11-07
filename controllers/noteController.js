const express = require('express');
var noteController = {};

// return the note info 
noteController.getNotesInfo = (req, res) => {
    res.send('getNotesInfo')
};

// return the user info 
noteController.createNote = (req, res) => {
    res.send('createNote')
};

// Edit note info
noteController.editNote = (req, res) => {
    res.send('editNote')
};

// Delete note by [id]
noteController.deleteNote = (req, res) => {
    res.send('deleteNote')
};


//////////// Admin //////////// 
// Admin edits any user
noteController.editAnyNote = (req, res) => {
    res.send('Admin editAnyNote')
};

// return all notes for admin 
noteController.getAnyOrAllNotes = (req, res) => {
    res.send('Admin getAnyOrAllNotes')
};

// Admin deletes note
noteController.deleteAnyNote = (req, res) => {
    res.send('Admin deleteAnyNote')
};

module.exports = noteController
