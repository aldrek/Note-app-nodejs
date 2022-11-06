const mongoose = require('mongoose')
const validator = require('validator')
var bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        require: true
    }, email: {
        type: String,
        validate:{
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email',
            isAsync: false
          }
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
        type: Date,
        default : ""
    }, created_at: {
        type: Date,
        default: Date.now()
    }

})

// Hashing the password before store it in the database 
userSchema.pre('save', function (next){
    this.password = this.hashPassword(this.password)
     next();
})

// funtion to hash passaword using genSaltSync and hashSync 
userSchema.methods.hashPassword = function(plainTextPassword) {
    var salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(plainTextPassword, salt)
}

// Showing the data object without password value
userSchema.methods.toJson = function () {
    var obj = this.toObject();
    delete obj.password;
    return obj;
}

module.exports = mongoose.model('user', userSchema);