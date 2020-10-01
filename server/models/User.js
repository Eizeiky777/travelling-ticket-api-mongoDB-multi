const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const moment = require('moment');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        minlength: 5
    },
    role: {
        type: Number,
        default: 0
    },
    platform: {
        type: String,
    },
    token: {
        type: String,
    }
})

userSchema.pre('save', function (next) {
    var user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err);
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function (cb) {
    var user = this;
    if (user.role === 1) {
        var token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60 * 1), _id: user._id }, process.env.SECRET_KEY_ADMIN)
    } else {
        var token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60 * 1), _id: user._id }, process.env.SECRET_KEY)
    }

    user.token = token;
    user.save(function (err, user) {
        if (err) return cb(err)
        cb(null, user);
    })
}

userSchema.statics.findByToken = function (token_jwt, cb) {
    var user = this;

    user.findOne({ "token": token_jwt }, function (err, status) {
        if (status.role === 1) {
            jwt.verify(token_jwt, process.env.SECRET_KEY_ADMIN, function (err, decode) {
                user.findOne({ "_id": decode, "token": token_jwt }, function (err, user) {

                    if (err) return cb(err);
                    cb(null, user);
                })
            })
        } else {
            jwt.verify(token_jwt, process.env.SECRET_KEY, function (err, decode) {
                user.findOne({ "_id": decode, "token": token_jwt }, function (err, user) {
                    if (err) return cb(err);
                    cb(null, user);
                })
            })
        }
    })
}

userSchema.statics.findByTokenAdmin = function (token_jwt, cb) {
    var user = this;
    jwt.verify(token_jwt, process.env.SECRET_KEY_ADMIN, function (err, decode) {
        user.findOne({ "_id": decode, "token": token_jwt }, function (err, user) {
            if (err) return cb(err);
            cb(null, user);
        })
    })
}


const User = mongoose.model('User', userSchema);

module.exports = { User }