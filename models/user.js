const mongoose = require('mongoose')
import { isEmail } from 'validator';


const userSchema = new mongoose({
    fullname : {
        type: String,
        require : true
    }, email : {
        type : String,
        validator : [isEmail , 'invalid email']
    },password : {
        type : String ,
        require : true
    },bio :{
        type : String,
        default : ""
    },access_token : {
        type : String , 
        default : String
    }, modified : {
        type : Date
    }, created_at : {
        type : Date,
        default : Date.now()
    }

})

module.exports = mongoose.model('user' , userSchema)