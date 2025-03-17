// const { default: mongoose } = require("mongoose");
const mongoose = require("mongoose");
// Phan quyen Admin , User
const roleSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        permissions: {
            type: Array,
            default: []
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date
    },
    {
        timestamps: true
    }
);
const Role = mongoose.model('Role', roleSchema, "roles");

module.exports = Role;  