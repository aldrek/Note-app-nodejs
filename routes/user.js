const express = require('express')
const router = express.Router()
const Users = require('../models/user')

router.get('/' , async function(req , res){
    const users = await Users.find({})
    res.send({
        users
    })
})

module.exports  = router