// const { default: mongoose } = require("mongoose");
const mongoose = require("mongoose");
// Phan quyen Admin , User
const settingGeneralSchema = new mongoose.Schema(
    {
        websiteName: String,
        logo: String,
        email: String,
        phone: String,
        address: String,
        copyright: String,
    },
    {
        timestamps: true
    }
);
const SettingGeneral = mongoose.model('SettingGeneral', settingGeneralSchema, "settings-general");

module.exports = SettingGeneral;  