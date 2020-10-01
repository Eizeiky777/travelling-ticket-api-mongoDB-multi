const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { User } = require("../../models/User");
const { auth, authAdmin } = require("../../middleware/auth");

const async = require('async');

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        platform: req.user.platform
    });
});


router.post("/register", (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        return res.status(422).json({ error: "please fill all the fields" })
    }

    User.findOne({ email: email, platform: "ghi_education" })
        .then((savedUser) => {
            if (savedUser && savedUser.platform === 'ghi_education') {
                return res.status(422).json({ error: "user already exist :)" })
            }
            const user = new User({
                name,
                email,
                password,
                platform: "ghi_education"
            })
            user.save((err, doc) => {
                if (err) return res.json({ success: false, err });
                return res.status(200).json({
                    success: true
                });
            });
        })
        .catch(err => {
            console.log(err)
        })
});

router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email, platform: "ghi_education" }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password or email" });
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id, token: user.token
                    });
            });
        });
    });
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id, platform: "ghi_education" }, { token: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});

router.put('/update_profile', auth, (req, res) => {

    bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(req.body.password, salt, function (err, hash) {
            if (err) return false;
            User.findByIdAndUpdate(req.user._id,
                {
                    $set: {
                        name: req.body.name,
                        email: req.body.email,
                        password: hash
                    }
                },
                { new: true },
                (err, result) => {
                    if (err) return res.status(422).json({ error: "failed updated" })
                    res.status(200).json({ success: true, result })
                }
            )
        })
    })
})

//=================================
//             Admin
//=================================

// GET 
router.get("/get_all_users/:order/:sortBy/:limit/:skip", authAdmin, (req, res) => {

    // pagination setting
    let order = req.params.order ? req.params.order : "desc";
    let sortBy = req.params.sortBy ? req.params.sortBy : "_id";
    let limit = req.params.limit ? parseInt(req.params.limit) : 10;
    let skip = req.params.skip ? parseInt(req.params.skip) : 0;

    User.find({ platform: "ghi_education" })
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, users) => {
            if (err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true, users, postSize: users.length })
        })
});


// UPDATE
router.put('/update_user', authAdmin, (req, res) => {

    bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(req.body.password, salt, function (err, hash) {
            if (err) return false;
            User.findByIdAndUpdate(req.body._id,
                {
                    $set: {
                        name: req.body.name,
                        email: req.body.email,
                        password: hash
                    }
                },
                { new: true },
                (err, result) => {
                    if (err) return res.status(422).json({ error: "failed updated" })
                    res.status(200).json({ success: true, result })
                }
            )
        })
    })
})

// DELETE
router.delete('/delete_user/:userId', authAdmin, (req, res) => {
    User.findOne({ _id: req.params.userId })
        .exec((err, user) => {
            if (err || !user) return res.status(422).json({ message: "user not found", error: err })
            user.remove()
                .then(result => {
                    res.json({ message: "successfully deleted", result: result })
                })
                .catch(err => {
                    res.status(422).json({ message: "failed deleting user", result: err })
                })
        })
})




module.exports = router;
