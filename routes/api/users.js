const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");

require("dotenv").config();

//Import Input Validation
const registerValidation = require("../../validation/register.js");
const loginValidation = require("../../validation/login");

// Import User model
const User = require("../../models/User");

// @route       POST api/users/register
// @desc        register  user
// @access      Public
router.post("/register", (req, res) => {
  //Destructuring
  const { name, email, password } = req.body;
  const { errors, isValid } = registerValidation(req.body);

  //Check Register validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const newUser = new User({
    name,
    email,
    password
  });

  newUser.save((err, doc) => {
    if (err) return res.json({ RegisterSuccess: false, err });
    res.status(200).json({
      RegisterSuccess: true
    });
  });
});

// @route       POST api/users/login
// @desc        Login User, Returns token
// @access      Public
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const { errors, isValid } = loginValidation(req.body);

  //Check Login validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email }, (err, user) => {
    if (!user)
      return res.json({
        loginSuccess: false,
        ErrorMessage: "User with email not found"
      });

    //Compare user passwords
    user.comparePasswords(password, (err, isMatch) => {
      //if passwords dont match
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          ErrorMessage: "Incorrect Password"
        });

      //If passwords match, generate token for user
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res
          .cookie("w_auth", user.token)
          .status(200)
          .json({
            loginSuccess: true
          });
      });
    });
  });
});

// @route       GET api/users/logout
// @desc        Logout user
// @access      Private
router.get("/logout", auth, (req, res) => {
  //find user by id and destroy token
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, doc) => {
    if (err) return res.json({ LogoutSuccess: false, err });
    return res.status(200).send({
      LogoutSuccess: true
    });
  });
});

// @route       GET api/users/auth
// @desc        Get auth user
// @access      Private
router.get("/auth", auth, (req, res) => {
  //return user data
  res.status(200).json({
    isAuth: true,
    email: req.user.email,
    name: req.user.name
  });
});
module.exports = router;
