const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            index: { unique: true }
        },
        email: {
            type: String,
            required: true,
            index: { unique: true }
        },
        password: {
            type: String,
            required: true
        },
        avatar: {
            type: String
        }
    },
    {
        // Data 자료형의 createdAt, updatedAt field 할당
        timestamps: true
    }
);

const User = mongoose.model('User', UserSchema);
module.exports = User;
