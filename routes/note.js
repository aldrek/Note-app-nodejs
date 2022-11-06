const express = require('express')
const router = express.Router();
const Note = require('../models/note');
const noteController = require('../controllers/noteController')

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

router.get('/list', noteController.getNotes)


module.exports = router