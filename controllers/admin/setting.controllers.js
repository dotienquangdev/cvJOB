const SettingGeneral = require("../../models/settings-general.model");
const { set } = require("mongoose");
// [GET] /admin/dashboard

module.exports.general = async (req, res) => {
    const settingGeneral = await SettingGeneral.findOne({

    });
    res.render("admin/pages/settings/general", {
        pageTitle: "Cài đặt chung",
        settingGeneral: settingGeneral,
    });
}

module.exports.generalPatch = async (req, res) => {
    console.log(req.body);
    const settingGeneral = new SettingGeneral(req.body);
    if (settingGeneral) {
        await SettingGeneral.updateOne({
            _id: settingGeneral.id,
        }, req.body);
    } else {
        const record = new SettingGeneral(req.body);
        await record.save();
    }
    // await settingGeneral.save();

    res.redirect("back");
}