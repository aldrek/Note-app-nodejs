const express = require('express')
const router = express.Router()
const Users = require('../models/user')
const userController = require('../controllers/userController')

router.get('/' , async function(req , res){
    const users = await Users.find({})
    res.send({
        users
    })
})

router.get('/list', userController.getUsers)

module.exports  = router