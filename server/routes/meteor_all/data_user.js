const express = require('express');
const router = express.Router();
const { User } = require("../../models/User");
const { auth, authAdmin } = require("../../middleware/auth");

// GET data based of app platform
router.get("/get_all_users/:order/:sortBy/:limit/:skip/:platform", (req, res) => {

    // pagination setting
    let order = req.params.order ? req.params.order : "desc";
    let sortBy = req.params.sortBy ? req.params.sortBy : "_id";
    let limit = req.params.limit ? parseInt(req.params.limit) : 10;
    let skip = req.params.skip ? parseInt(req.params.skip) : 0;
    let platform = req.params.platform ? req.params.platform : "abc_education";

    User.find({ platform })
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, users) => {
            if (err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true, users, postSize: users.length })
        })
});

router.get("/get_all_users/:order/:sortBy/:limit/:skip", (req, res) => {

    // pagination setting
    let order = req.params.order ? req.params.order : "desc";
    let sortBy = req.params.sortBy ? req.params.sortBy : "_id";
    let limit = req.params.limit ? parseInt(req.params.limit) : 10;
    let skip = req.params.skip ? parseInt(req.params.skip) : 0;

    User.find()
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, users) => {
            if (err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true, users, postSize: users.length })
        })
});


module.exports = router;