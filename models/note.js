const mongoose = require('mongoose')

const noteSchema = mongoose.Schema({
    title : {
        type : String , 
        require : true
    }, description : {
        type : String , 
        require : true
    }, modified: {
        type: Date,
        default : ""
    }, created_at: {
        type: Date,
        default: Date.now()
    }, owner : {
        type : mongoose.Schema.Types.ObjectId , 
        ref : 'user'
    }

}, { collection: 'note' })

module.exports = mongoose.model('note' , noteSchema);