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

// Function to fetch the list of books using Axios
const fetchBookList = async () => {
  try {
    const response = await axios.get('http://example.com/books'); // Replace 'http://example.com/books' with your actual endpoint for fetching books
    return response.data;
  } catch (error) {
    console.error("Error fetching book list:", error);
    throw new Error("Error fetching book list");
  }
};

// Route to get the list of books available in the shop
public_users.get('/', async function (req, res) {
  try {
    // Retrieve the list of books asynchronously
    const bookList = await fetchBookList();

    // Display the list of books neatly using JSON.stringify
    return res.status(200).send(JSON.stringify(bookList, null, 2));
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Function to fetch book details based on ISBN using Axios
const fetchBookDetails = async (isbn) => {
  try {
    const response = await axios.get(`http://example.com/books/${isbn}`); // Replace 'http://example.com/books/${isbn}' with your actual endpoint for fetching book details by ISBN
    return response.data;
  } catch (error) {
    console.error("Error fetching book details:", error);
    throw new Error("Error fetching book details");
  }
};

// Route to get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    // Retrieve the ISBN from the request parameters
    const isbn = req.params.isbn;

    // Fetch book details asynchronously
    const bookDetails = await fetchBookDetails(isbn);

    // If book found, return the book details
    return res.status(200).json(bookDetails);
  } catch (error) {
    // If error occurs during fetch or processing, return 500 status with an error message
    return res.status(500).json({ message: "Internal server error" });
  }
});

  
// Function to fetch book details based on author using Axios
const fetchBooksByAuthor = async (author) => {
  try {
    const response = await axios.get(`http://example.com/books?author=${author}`); // Replace 'http://example.com/books?author=${author}' with your actual endpoint for fetching book details by author
    return response.data;
  } catch (error) {
    console.error("Error fetching books by author:", error);
    throw new Error("Error fetching books by author");
  }
};

// Route to get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    // Retrieve the author from the request parameters
    const author = req.params.author;

    // Fetch books by author asynchronously
    const booksByAuthor = await fetchBooksByAuthor(author);

    // If books found, return the book details
    if (booksByAuthor.length > 0) {
      return res.status(200).json(booksByAuthor);
    } else {
      // If no books found, return an error message
      return res.status(404).json({ message: "No books found by the author" });
    }
  } catch (error) {
    // If error occurs during fetch or processing, return 500 status with an error message
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Function to fetch book details based on title using Axios
const fetchBooksByTitle = async (title) => {
  try {
    const response = await axios.get(`http://example.com/books?title=${title}`); // Replace 'http://example.com/books?title=${title}' with your actual endpoint for fetching book details by title
    return response.data;
  } catch (error) {
    console.error("Error fetching books by title:", error);
    throw new Error("Error fetching books by title");
  }
};

// Route to get book details based on title
public_users.get('/title/:title', async function (req, res) {
  try {
    // Retrieve the title from the request parameters
    const title = req.params.title;

    // Fetch books by title asynchronously
    const booksByTitle = await fetchBooksByTitle(title);

    // If books found, return the book details
    if (booksByTitle.length > 0) {
      return res.status(200).json(booksByTitle);
    } else {
      // If no books found, return an error message
      return res.status(404).json({ message: "No books found by the title" });
    }
  } catch (error) {
    // If error occurs during fetch or processing, return 500 status with an error message
    return res.status(500).json({ message: "Internal server error" });
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

