// Require the mongose library
const mongoose = require('mongoose');

// Define the note's database schema
const noteSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        // Date 자료형으로 createAt, updateAt field 할당
        timestamps: true
    }
);

// schema와 함께 'Note' model 정의
const Note = mongoose.model('Note', noteSchema);

// module export
module.exports = Note;