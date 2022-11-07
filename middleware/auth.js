const jwt = require('jsonwebtoken')
const User = require('../models/user')


// Check if the api_key matches server's key then checks if token exits or not
// case : 
// Exist -> Go next 
// Not exist -> return 401 
module.exports = async (req, res, next) => {

    try {

        // Fetch token then check if it's jwt valid stuture
        const token = req.header('Authorization').replace('Bearer ', '')
        const decodedToken = jwt.verify(token, 'TOKEN')

        // Exract userId from token
        const userId = decodedToken.userId
        console.log(userId)

        // Check if this userId from token is the same
        if (req.body.userId && req.body.userId != userId) {
            throw 'Invalid user ID';
            } else {

            const user = await User.findOne({_id : /*decodedToken._id*/ userId , 'tokens.token' : header })
            req.user = user
            console.log(user)
            next()

        }

    } catch (e) {
    
        console.log(e)
        res.status(401).send({
            error: 'Invalid token!'
        })

    }

}