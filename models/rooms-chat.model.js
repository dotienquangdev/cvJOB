const mongoose = require("mongoose");

const roomsChatSchema = new mongoose.Schema(
    {
        title: String,
        avatar: String,
        typeRoom: String,
        status: String,
        theme: String,
        users: [
            {
                user_id: String,
                role: String,
            },
        ],
        deleted: {
            type: Boolean,
            default: false,
        },
        deleted: Date,
    },
    {
        timestamps: true,
    }
);

const RoomChat = mongoose.model('RoomChat', roomsChatSchema, "rooms-chat");

module.exports = RoomChat;