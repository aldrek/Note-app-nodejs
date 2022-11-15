const mongoose = require('mongoose')

const noteSchema = mongoose.Schema({
    title: {
        type: String,
        require: true
    }, description: {
        type: String,
        require: true
    }, modified: {
        type: Date,
        default: Date.now()
    }, created_at: {
        type: Date,
        default: Date.now()
    }, owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }, activeFlag: {
        type: Boolean,
        default: false
    }

}, { collection: 'note' })

// noteSchema.virtual('notes', {
//     ref: 'note',
//     localField: '_id',
//     foreignField: 'owner'
// })

noteSchema.statics.editNote = async (req, res, isAdmin) => {

    const user = req.user

    const noteId = req.params.uid

    let note = await Note.findById(noteId)

    note.title = req.body.title
    note.description = req.body.description

    if (note) {
        if (!isAdmin) {
            if (user._id.toString() === note.owner.toString()) {

                // refactor
                await note.save()
                console.log(note)
                responseWithSuccessMessage(res, note)

            } else {

                respondWithErrorMessage(res)
                console.log(user._id.toString(), note.owner.toString())
            }
        } else {

            // refactor
            await note.save()
            responseWithSuccessMessage(res, note)

        }
    } else {

        respondWithErrorMessage(res)
    }

}

// Delete note as admin is hard delete and for user is soft delete 
// For user check if user owns the note 
noteSchema.statics.deleteNote = async (req, res, isAdmin) => {

    try {

        let check = false

        if (!isAdmin) {

            let note = await Note.findById({ _id: req.params.uid })

            if (note) {

                // Query for checking if user owns the note 
                if (note.owner.toString() === req.user._id.toString()) {
                    note.activeFlag = false
                    await note.save();
                    responseWithSuccessMessage(res, note)
                } else {
                    respondWithErrorMessage(res)
                }

            } else {
                respondWithErrorMessage(res)
            }

        } else {

            check = await Note.findOneAndDelete({ _id: req.params.uid },)
            if (!check) respondWithErrorMessage()
            else
                res.json({
                    status: true,
                    message: "Success"
                })

        }


    } catch (e) {

        respondWithErrorMessage(res)
    }

}

function respondWithErrorMessage(res) {
    res.json({
        status: false,
        message: "Something went wrong"
    })
}

function responseWithSuccessMessage(res, newNote) {
    res.json({
        status: true,
        message: "Success",
        data: newNote
    })
}

const Note = mongoose.model('note', noteSchema);
module.exports = Note