require('dotenv').config()

// Check if api key is the same as the one from server
module.exports = (req , res , next) => {
    const apiKey = req.headers.api_key
    if(process.env.API_KEY !== apiKey){
        res.send({
            message : "You are not allowed to use this api"
        })
    }else{
        next()
    }
}