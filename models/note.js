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
        default: Date.now()
    }, created_at: {
        type: Date,
        default: Date.now()
    }, owner : {
        type : mongoose.Schema.Types.ObjectId , 
        ref : 'user',
        required: true
    }

}, { collection: 'note' })

noteSchema.virtual('note', {
    ref: 'note',
    localField: '_id',
    foreignField: 'owner'
})

module.exports = mongoose.model('note' , noteSchema);