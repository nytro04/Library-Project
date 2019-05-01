const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");

require("dotenv").config();

//Routes Imports
const users = require("./routes/api/users");

const app = express();

//Bodyparser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Connect to mongoose
mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("Mongo Connected..."))
  .catch(err => console.log(err));

// Passport Config
app.use(passport.initialize());
require("./passport/passport")(passport);

// API Routes
app.use("/api/users", users);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port} 🚀...`));
