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

    try {

        const currentUser = req.user
        const { sort, page, limit } = req.query;

        let notes = await User.findById(currentUser._id).populate({
            path: 'notes', options: {
                limit: parseInt(limit),
                skip: parseInt(page) * parseInt(limit),
                sort: { created_at: 1 }
            }
        })

        console.log(notes)

        if (!notes) res.json({
            status: false,
            data: 'Something went wrong'
        })
        else res.json({
            status: true,
            data: notes.notes
        })

    } catch (e) {
        console.log(e)
    }


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

    Note.editNote(req, res, req.user.isAdmin)

}

// Delete note by [id]
// Soft delete and allow revoke deletation for a week 

noteController.deleteNote = async (req, res) => {

    Note.deleteNote(req, res, req.user.isAdmin)

};

//////////// Admin //////////// 
// Admin edits any user
noteController.editAnyNote = async (req, res) => {

    User.editNote(req, res, req.user.isAdmin)

};

// return all notes for admin 
noteController.getAnyOrAllNotes = async (req, res) => {

    const { limit, page, id, age } = req.body
    const user = req.user

    const result = await Note.find().limit(limit).skip(limit * page).sort({ 'created_at': -1 }).exec()
    const count = await Note.countDocuments()

    res.json({
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        data: result
    })

};

// Admin deletes note
noteController.deleteAnyNote = async (req, res) => {

    Note.deleteNote(req, res, req.user.isAdmin)

};

module.exports = noteController
