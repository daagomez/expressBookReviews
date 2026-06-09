const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!doesExist(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;

    // Revisare la valore dela envio
    // return res.status(300).json({message: `Value: ${author}`});
    let authorBooks = Object.values(books).filter(book => book.author == author);
    // return res.send(authorBooks);
    res.send(JSON.stringify(authorBooks,null,4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;

    // Revisare la valore dela envio
    // return res.status(300).json({message: `Value: ${author}`});
    let titleBooks = Object.values(books).filter(book => book.title == title);
    // return res.send(authorBooks);
    res.send(JSON.stringify(titleBooks,null,4));

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn= req.params.isbn;
    
    let title = books[isbn].title;
    let review = books[isbn].reviews;
    // return res.send({title, review})
    return res.send(JSON.stringify({title, review},null,4));
    // Revisare la valore dela envio
    // return res.status(300).json({message: `Value: ${author}`});
    // let reviewBooks = Object.values(books).filter(book => book.isbn == isbn);
    // return res.send(authorBooks);["title", "review"]
    // return res.send(JSON.stringify(reviewBooks,null,4));

});

module.exports.general = public_users;
