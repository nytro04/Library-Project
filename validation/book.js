const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function bookInputValidation(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";
  data.author = !isEmpty(data.author) ? data.author : "";
  data.genre = !isEmpty(data.genre) ? data.genre : "";

  if (Validator.isEmpty(data.title)) {
    errors.title = "Title field is required";
  }

  if (Validator.isEmpty(data.author)) {
    errors.author = "Author field is required";
  }

  if (Validator.isEmpty(data.genre)) {
    errors.genre = "Genre field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
