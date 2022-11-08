const express = require('express');
const Note = require('../models/note');
const User = require('../models/user');
var noteController = {};

// return the note info 
noteController.getNotesInfo = async (req, res) => {

    const userId = req.user._id
    const note = await Note.findOne({ _id: req.params.uid })

    if (!note) {
        res.json({
            message: "Note found"
        })
    } else {
        console.log(note.owner, userId)
        // Check if you own the note
        if (note.owner._id.toString() === userId._id.toString()) {
            res.json({
                data: note
            })
        } else {
            res.json({
                message: "Note found"
            })
        }

    }


};

// return the note info 
noteController.getAllNotesInfo = async (req, res) => {

    const currentUser = req.user

    const user = await User.findById({ _id: currentUser._id }).populate('notes').exec(function (err, user) {
        if (err) res.json({
            data: []
        })

        res.json({
            data: user.notes
        })
    });

};


// return the user info 
noteController.createNote = async (req, res) => {

    let newNote = new Note(req.body)
    let savedNote = await newNote.save()

    res.send({
        data: savedNote
    })

};

// Edit note info
noteController.editNote = async (req, res) => {

    const user = req.user
    const newNote = await Note.findByIdAndUpdate(req.params.uid, {
        title: req.body.title,
        description: req.body.description,
    }, { new: true })

    if (!newNote) {
        res.json({
            status: false,
            message: "Something went wrong"
        })
    } else {
        res.json({
            status: true,
            message: "Success",
            data: newNote
        })
    };
}

// Delete note by [id]
noteController.deleteNote = async (req, res) => {

    const check = await Note.findOneAndDelete({ _id: req.params.uid })
    console.log(check)

    if (!check) res.json({
        status: false,
        message: "Something went wrong"
    })

    res.json({
        status: true,
        message: "Success"
    })

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
