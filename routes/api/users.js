const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
require("dotenv").config();

//Import Input Validation
const registerValidation = require("../../validation/register.js");
const loginValidation = require("../../validation/login");

// Import User model
const User = require("../../models/User");

//<====== User Api Routes start here ======>

// @route       POST api/users/register
// @desc        register  user
// @access      Public
router.post("/register", (req, res) => {
  // const { email, password } = req.body;
  const { errors, isValid } = registerValidation(req.body);

  //Check Register validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // check if the email(user) is already registered
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email is already taken";
      return res.status(400).json(errors);
    } else {
      // create new user if email(user) is not registered
      const newUser = new User({
        fullName: req.body.fullName,
        email: req.body.email,
        password: req.body.password
      });

      //Hash password with bcrypt
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hashedPassword) => {
          if (err) throw err;
          newUser.password = hashedPassword;

          // Save with mongoose
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route       POST api/users/login
// @desc        Login User, Returns JWT Token
// @access      Public
router.post("/login", (req, res) => {
  // const { email, password } = req.body;
  const { errors, isValid } = loginValidation(req.body);

  //Check Login validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then(user => {
    //check if user exist
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    //Check and compare password of the user
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //if password match

        // Create JWT Payload
        const payload = { id: user.id, fullName: user.fullName };

        const secret = process.env.SECRET;

        //Sign Token
        jwt.sign(payload, secret, { expiresIn: 36000 }, (err, token) => {
          res.json({ success: true, token: "Bearer " + token });
        });
      } else {
        errors.password = "Incorrect password";
        return res.status(400).json(errors);
      }
    });
  });
});

// @route       POST api/users/auth
// @desc        Returns current authenticated user
// @access      Private
router.get(
  "/auth",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    req.json(req.user);
  }
);

module.exports = router;
