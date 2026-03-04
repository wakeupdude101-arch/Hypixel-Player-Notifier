const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    discordId: {
        type: String,
        required: true,
        unique: true,
    },
    hypixelKey: {
        type: String,
    },
    trackedPlayers: [
        {
            uuid: {
                type: String,
            },
            lastStatus: {
                type: Boolean,
                default: false,
            },
            username: {
                type: String,
            },
            lastArea: {
                type: String,
                default: 'Unknown',
            },
        },
    ]
});

const User = mongoose.model('User', UserSchema);
module.exports = User;