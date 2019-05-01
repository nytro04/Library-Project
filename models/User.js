const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  fullName: {
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
    required: true
  }
});

module.exports = User = mongoose.model("users", UserSchema);
