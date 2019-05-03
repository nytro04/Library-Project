const User = require("../models/User");

const auth = (req, res, next) => {
  //grab token from the cookie in req.
  const token = req.cookies.w_auth;

  //Find user by token
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true });

    req.token = token;
    req.user = user;
    next();
  });
};

module.exports = auth;
