const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  // Write code to check if the username is valid
  // This can be implemented based on your specific validation criteria
}

const authenticatedUser = (username,password)=>{ 
  // Write code to check if username and password match the one we have in records
  return users.some(user => user.username === username && user.password === password);
}

// Only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username and password are valid
  if (authenticatedUser(username, password)) {
    // If valid, generate JWT token
    const accessToken = jwt.sign({ username }, 'secretKey', { expiresIn: '1h' });
    return res.status(200).json({ message : "Customer successfully logged in" });
  } else {
    // If invalid, return error message
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // Retrieve the username from the session (assuming it's stored in req.user)
  const username = req.user.username;

  // Retrieve the ISBN and review from the request parameters
  const { isbn } = req.params;
  const review = req.query.review;

  // Check if the book exists in the books database
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the user has already posted a review for this ISBN
  if (books[isbn].reviews[username]) {
    // If user has already posted a review, modify the existing review
    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review updated successfully" });
  } else {
    // If user has not posted a review, add a new review
    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review added successfully" });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    // Retrieve the username from the session (assuming it's stored in req.user)
    const username = req.user.username;
  
    // Retrieve the ISBN from the request parameters
    const { isbn } = req.params;
  
    // Check if the book exists in the books database
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Check if the user has posted a review for this ISBN
    if (!books[isbn].reviews[username]) {
      return res.status(404).json({ message: "Review not found for this user" });
    }
  
    // Delete the user's review for this ISBN
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully" });
  });
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
