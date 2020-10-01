const { User } = require('../models/User');

let auth = (req, res, next) => {
    let token = req.cookies.w_auth;
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ error: "you must be login" })
    }

    const token_jwt = authorization.replace("Bearer ", "")


    User.findByToken(token_jwt, (err, user) => {
        if (err) throw err;
        if (!user)
            return res.json({
                message: "token has expired or you are not login",
                isAuth: false,
                error: true
            });

        req.token = token;
        req.user = user;
        next();
    });
};

let authAdmin = (req, res, next) => {
    let token = req.cookies.w_auth;
    const { authorization } = req.headers
    if (!authorization) {
        return res.status(401).json({ error: "you must be login" })
    }
    const token_jwt = authorization.replace("Bearer ", "")

    User.findByTokenAdmin(token_jwt, (err, user) => {
        if (err) throw err;
        if (!user)
            return res.json({
                message: "unauthorized",
                isAuth: false,
                error: true
            });

        req.token = token;
        req.user = user;
        next();
    });
};


module.exports = { auth, authAdmin };
