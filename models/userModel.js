const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    "githubId": {
        type: String,
        required: true,
        unique: true
    },
    "username": {
        type: String,
        required: true,
        unique: true
    },
    "avatar_url": {
        type: String
    },
    "email": {
        type: String,
        required: true,
        unique: true
    },
    "create_at": {
        type: Date,
        default: new Date
    }
});

module.exports = mongoose.model('User', UserSchema);
