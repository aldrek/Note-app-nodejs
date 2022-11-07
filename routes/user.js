const express = require('express')
const router = express.Router()
const Users = require('../models/user')
const userController = require('../controllers/userController')
const userAuth = require('../middleware/auth')
const apiAuth = require('../middleware/apiAuth')

router.get('/' , async function(req , res){
    const users = await Users.find({})
    res.send({
        users
    })
})

router.get('/admin/list', userController.getAnyOrAllUsers)
router.delete('/admin/:uid', userController.deleteAnyUsers)
router.put('/admin/edit/:uid', userController.editAnyUser)

router.post('/register', apiAuth ,userController.register)
router.post('/login',apiAuth ,userController.login)
router.get('/me', userController.getUserInfo)
router.put('/edit/:uid', userController.editUser)
router.delete('me', userController.deleteUser)
router.post('/logout', apiAuth ,userAuth  ,userController.logout)

module.exports  = router