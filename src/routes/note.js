const express = require('express')
const router = express.Router();
const Note = require('../models/note');
const apiAuth = require('../middleware/apiAuth')
const userAuth = require('../middleware/auth')
const noteController = require('../controllers/noteController')
const adminAuth = require('../middleware/adminAuth')

router.get('/' , async function(req , res){

    let note = await new Note({
        title: "title",
        description: "title",
        owner: "6367c23070f776e7e32b7791"
    }).save().then(doc => {
        console.log(doc)
    
    }).catch(err => {
        console.log(err)
    })
    res.send('success')
})

router.get('/admin/list', apiAuth,  userAuth ,adminAuth , noteController.getAnyOrAllNotes)
router.put('/admin/update/:uid', apiAuth , userAuth ,adminAuth , noteController.editAnyNote)
router.delete('/admin/delete/:uid',apiAuth , userAuth ,adminAuth , noteController.deleteAnyNote)

router.post('/create',apiAuth , userAuth ,   noteController.createNote)
router.get('/all', apiAuth , userAuth , noteController.getAllNotesInfo)
router.get('/:uid', apiAuth , userAuth , noteController.getNotesInfo)
router.put('/update/:uid', apiAuth , userAuth , noteController.editNote)
router.delete('/delete/:uid',  apiAuth , userAuth , noteController.deleteNote)

module.exports = router