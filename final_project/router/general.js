const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  // Extract username and password from the request body
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if username already exists
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // If username is unique, add the new user
  users.push({ username, password });
  return res.status(201).json({ message: "User successfully registered. You can now login." });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Retrieve the list of books
  const bookList = Object.values(books);

  // Display the list of books neatly using JSON.stringify
  return res.status(200).send(JSON.stringify(bookList, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  // Retrieve the ISBN from the request parameters
  const isbn = req.params.isbn;

  // Find the book details based on ISBN
  const book = books[isbn];

  if (book) {
    // If book found, return the book details
    return res.status(200).json(book);
  } else {
    // If book not found, return an error message
    return res.status(404).json({ message: "Book not found" });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  // Retrieve the author from the request parameters
  const author = req.params.author;

  // Filter books by author
  const booksByAuthor = Object.values(books).filter(book => book.author === author);

  if (booksByAuthor.length > 0) {
    // If books found, return the book details
    return res.status(200).json(booksByAuthor);
  } else {
    // If no books found, return an error message
    return res.status(404).json({ message: "No books found by the author" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  // Retrieve the title from the request parameters
  const title = req.params.title;

  // Filter books by title
  const booksByTitle = Object.values(books).filter(book => book.title === title);

  if (booksByTitle.length > 0) {
    // If books found, return the book details
    return res.status(200).json(booksByTitle);
  } else {
    // If no books found, return an error message
    return res.status(404).json({ message: "No books found by the title" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  // Retrieve the ISBN from the request parameters
  const isbn = req.params.isbn;

  // Find the book reviews based on ISBN
  const book = books[isbn];

  if (book) {
    // If book found, return the book reviews
    const reviews = book.reviews;
    return res.status(200).json(reviews);
  } else {
    // If book not found, return an error message
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;

