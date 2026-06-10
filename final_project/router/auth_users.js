const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
users = [
    {
    "username": "user",
    "password": "password"
    }
];

const isValid = (username)=>{ //returns boolean
    let validusers = users.filter((user) => {
        return (user.username === username );
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }}

const authenticatedUser = (username,password)=>{ //returns boolean
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {

    const username = req.body.username;
    const password = req.body.password;

    // return res.status(300).json({message: `usuario: ${username} contraseña: ${password}`});
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    
    // return res.status(300).json({message: `validos: ${authenticatedUser(username, password)}`})
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // res.status(200).json(`autorización: ${accessToken}`)

        // Store access token and username in session

        req.session.authorization = {
            accessToken, username
        };
        
        // res.status(200).json(`autorización: ${req.session.authorisation}`)

        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let book = books[isbn];
    // return 

    if(book) {
        let review = req.body.review;
        let username = req.session.authorization.username;
        //return res.status(300).json({message: `review: ${review} usuario: ${username}`});
        // return res.status(300).json({message: `book: ${typeof book}`})
        if (review) {
            book.reviews[username] = review;
        }
        
        books[isbn] = book;
        res.status(200).json({message: `${book.title} successfully reviewed by ${username}`});
    } else {
        res.status(208).json({message: "Invalid ISBN"});
    }
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let book = books[isbn];

    if (book) {
        let username = req.session.authorization.username;
        if (book.reviews[username]){
            delete book.reviews[username]; 
            res.status(200).json({message: `The review of ${book.title} by ${username} was successfully deleted`});
        } else {
            res.status(208).json({message: `There is no review of ${book.title} by ${username}`});
        }
    } else {
        res.status(208).json({message: "Invalid ISBN"});
    }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
