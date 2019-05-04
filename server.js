const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

//Routes Imports
const users = require("./routes/api/users");
const books = require("./routes/api/books");

const app = express();

//Bodyparser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//Views config
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//Connect to mongoose
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => console.log("Mongo Connected..."))
  .catch(err => console.log(err));

// API Routes
app.use("/api/users", users);
app.use("/api/books", books);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port} 🚀...`));
