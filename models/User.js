const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const salt = 10;
require("dotenv").config();

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    minlength: 5,
    maxlength: 100,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    minlength: 5,
    maxlength: 100,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  token: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

//Hashing passwords when registering
UserSchema.pre("save", function(next) {
  const user = this;

  if (user.isModified("password")) {
    bcrypt.genSalt(salt, function(err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function(err, hashedPassword) {
        if (err) return next(err);
        user.password = hashedPassword;
        next();
      });
    });
  } else {
    next();
  }
});

//Comparing paswords at login
UserSchema.methods.comparePasswords = function(userPassword, cb) {
  bcrypt.compare(userPassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

//Generate json web token
UserSchema.methods.generateToken = function(cb) {
  const user = this;
  const token = jwt.sign(user._id.toHexString(), process.env.SECRET);

  user.token = token;
  user.save(function(err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

//Decode jwt
UserSchema.statics.findByToken = function(token, cb) {
  const user = this;

  //decode jwt
  jwt.verify(token, process.env.SECRET, function(err, decode) {
    user.findOne({ _id: decode, token: token }, function(err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

module.exports = User = mongoose.model("users", UserSchema);
