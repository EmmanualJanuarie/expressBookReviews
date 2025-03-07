const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const axios = require('axios');


public_users.post("/register", (req, res) => {
  const { username, password } = req.body; // Extract username and password from request body

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // Register the new user
  users.push({ username, password }); // In a real application, make sure to hash the password
  return res.status(201).json({ message: "User  registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
   return res.send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Retrieve the ISBN from the request parameters
  const book = books.find(b => b.isbn === isbn); // Find the book by ISBN

  if (book) {
      return res.send(JSON.stringify(book, null, 2)); // Send the book details as a response
  } else {
      return res.status(404).json({ message: "Book not found" }); // Handle case where book is not found
  }
});


// Get book details based on ISBN using Axios
public_users.get('/books/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn; // Get the ISBN from the URL parameters

  try {
      //API endpoint
      const response = await axios.get(`/books/isbn/${isbn}`);
      const book = response.data; // API returns the book details in the response data

      if (book) {
          return res.status(200).json(book); // Send the book details as a response
      } else {
          return res.status(404).json({ message: "Book not found" }); // Handle case where book is not found
      }
  } catch (error) {
      console.error('Error fetching book details:', error);
      return res.status(500).json({ message: 'Error fetching book details' });
  }
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  
  // Obtain all the keys for the 'books' array
  const booksByAuthor = books.filter(b => b.author.toLowerCase() === author.toLowerCase());
  
  // Check if any books were found
  if (booksByAuthor.length > 0) {
    return res.send(JSON.stringify(booksByAuthor, null, 2));
  } else {
    return res.status(404).json({ message: "No books found by this author" });
  }
});

// Get book details based on Author using Axios
public_users.get('/books/author/:author', async (req, res) => {
  const author = req.params.author; // Get the author from the URL parameters

  try {
      // Replace with your actual API endpoint
      const response = await axios.get(`books/author/${author}`);
      const booksByAuthor = response.data; //the API returns the list of books by the author in the response data

      if (booksByAuthor.length > 0) {
          return res.status(200).json(booksByAuthor); // Send the list of books as a response
      } else {
          return res.status(404).json({ message: "No books found by this author" }); // Handle case where no books are found
      }
  } catch (error) {
      console.error('Error fetching books by author:', error);
      return res.status(500).json({ message: 'Error fetching books by author' });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const booksByTitle = books.filter(b => b.title === title);
  if (booksByTitle.length > 0) {
    return res.send(JSON.stringify(booksByTitle, null, 2));
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});


// Get book details based on Title using Axios
public_users.get('/books/title/:title', async (req, res) => {
  const title = req.params.title; // Get the title from the URL parameters

  try {
      // Replace with your actual API endpoint
      const response = await axios.get(`books/title/${title}`); 
      const booksByTitle = response.data; //API returns the list of books by the title in the response data

      if (booksByTitle.length > 0) {
          return res.status(200).json(booksByTitle); // Send the list of books as a response
      } else {
          return res.status(404).json({ message: "No books found with this title" }); // Handle case where no books are found
      }
  } catch (error) {
      console.error('Error fetching books by title:', error);
      return res.status(500).json({ message: 'Error fetching books by title' });
  }
});

// Get book reviews based on ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Retrieve the ISBN from the request parameters
  const book = books.find(b => b.isbn === isbn); // Find the book by ISBN

  if (book) {
      if (book.reviews && Object.keys(book.reviews).length > 0) {
          return res.send(JSON.stringify(book.reviews, null, 2)); // Send the reviews as a response
      } else {
          return res.status(404).json({ message: "No reviews found for this book" }); // Handle case where no reviews exist
      }
  } else {
      return res.status(404).json({ message: "Book not found" }); // Handle case where book is not found
  }
});

// Get the book list available in the shop using Axios
public_users.get('/books', async (req, res) => {
  try {
      // Replace with your actual API endpoint
      const response = await axios.get('/books');
      const books = response.data; // Assuming the API returns the list of books in the response data
      return res.status(200).json(books); // Send the list of books as a response
  } catch (error) {
      console.error('Error fetching books:', error);
      return res.status(500).json({ message: 'Error fetching books' });
  }
});

module.exports.general = public_users;
