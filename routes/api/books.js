const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

// Import Book Model
const Book = require("../../models/Book");

// Import Validation
const bookValidation = require("../../validation/book");

// @route       GET api/books
// @desc        Get all books
// @access      Public
router.get("/", (req, res) => {
  Book.find()
    .sort({ date: -1 })
    .then(books => res.render("../../views/index.ejs", { data: books }));
  // .catch(err => res.status(404).render({ nobooksfound: "No Books found" }));
});

// @route       POST api/books
// @desc        Create book
// @access      Private
router.post("/", auth, (req, res) => {
  // Destructuring
  const { errors, isValid } = bookValidation(req.body);
  const { title, author, genre } = req.body;

  //Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // Create new Book
  const newBook = new Book({
    title,
    author,
    genre
  });
  console.log(newBook);

  // save new Book to db
  newBook.save((err, doc) => {
    if (err) return res.json({ addBookSuccess: false, err });
    res.status(200).json({
      addBookSuccess: true,
      book: doc
    });
  });
});

// @route       PUT api/books/:id
// @desc        Edit book
// @access      Private
router.put("/:id", auth, (req, res) => {
  // Destructuring
  const { errors, isValid } = bookValidation(req.body);
  const { title, author, genre } = req.body;

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Book.findById(req.params.id).then(book => {
    // console.log(book);

    if (!book)
      return res.json({
        updateBookSuccess: false,
        errorMessage: "Could not find book"
      });

    book.title = title;
    book.author = author;
    book.genre = genre;

    // console.log(book);

    book
      .save()
      .then(() => {
        res.status(200).json({ updateBookSuccess: true });
      })
      .catch(err =>
        res.status(404).json({ booknotfound: "No book found to delete", err })
      );
  });
});

// @route       DELETE api/books/:id
// @desc        Delete book
// @access      Private
router.delete("/:id", auth, (req, res) => {
  Book.findById(req.params.id).then(book => {
    // if (book.user !== req.user.id) {
    //   return res
    //     .status(401)
    //     .json({ notauthorized: "User not authorized to delete" });
    // }
    if (!book)
      return res.json({
        updateBookSuccess: false,
        errorMessage: "Could not find book"
      });

    book
      .remove()
      .then(() => res.json({ deleteSuccess: true }))
      .catch(err =>
        res.status(404).json({ booknotfound: "No book found to delete" })
      );
  });
});

module.exports = router;
