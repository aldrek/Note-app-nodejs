const mongoose = require('mongoose')
const isEmail = require('validator')
var bcrypt = require('bcrypt');

const userSchema = new mongoose({
    fullname: {
        type: String,
        require: true
    }, email: {
        type: String,
        validator: [isEmail, 'invalid email']
    }, password: {
        type: String,
        require: true
    }, bio: {
        type: String,
        default: ""
    }, access_token: {
        type: String,
        default: String
    }, modified: {
        type: Date
    }, created_at: {
        type: Date,
        default: Date.now()
    }

})

module.exports = mongoose.model('user', userSchema)