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
    // Defarult task 1
    // res.send(JSON.stringify(books,null,4));

    // For task 10
    let promise = new Promise((resolve, reject) => {
        retrieved = JSON.stringify(books,null,4)
        if (retrieved) {
            res.send(retrieved);
            resolve('Retrieved data successfully');
        } else {
            reject('Somethingh went wrong.');
        }
    });
    
    promise.then(result => {
            console.log(result); // This will run if the Promise is fulfilled
        })
        .catch(error => {
            console.error(error); // This will run if the Promise is rejected
        })
        .finally(() => {
            console.log('The promise has completed'); // This will run when the Promise is settled
    });
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    // Default task 2
    // const isbn = req.params.isbn;
    // res.send(books[isbn]);

    // Task 11
    let promise = new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        retrieved = books[isbn];

        if (retrieved) {
            res.send(retrieved);
            resolve('Retrieved data successfully');
        } else {
            reject('Somethingh went wrong.');
        }
    });
    
    promise.then(result => {
            console.log(result); // This will run if the Promise is fulfilled
        })
        .catch(error => {
            console.error(error); // This will run if the Promise is rejected
        })
        .finally(() => {
            console.log('The promise has completed'); // This will run when the Promise is settled
    });

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    // Original task 3
    // const author = req.params.author;

    // Revisare la valore dela envio
    // return res.status(300).json({message: `Value: ${author}`});
    // let authorBooks = Object.values(books).filter(book => book.author == author);
    // return res.send(authorBooks);
    // res.send(JSON.stringify(authorBooks,null,4));
    
    // Task 12
    let promise = new Promise((resolve, reject) => {
        const author = req.params.author;
        let authorBooks = Object.values(books).filter(book => book.author == author);
        retrieved = JSON.stringify(authorBooks,null,4);
        if (retrieved) {
            res.send(retrieved);
            resolve('Retrieved data successfully');
        } else {
            reject('Somethingh went wrong.');
        }
    });
    
    promise.then(result => {
            console.log(result); // This will run if the Promise is fulfilled
        })
        .catch(error => {
            console.error(error); // This will run if the Promise is rejected
        })
        .finally(() => {
            console.log('The promise has completed'); // This will run when the Promise is settled
    });


});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    // Default task 4
    // const title = req.params.title;

    // Revisare la valore dela envio
    // return res.status(300).json({message: `Value: ${author}`});
    // let titleBooks = Object.values(books).filter(book => book.title == title);
    // return res.send(authorBooks);
    // res.send(JSON.stringify(titleBooks,null,4));

    // Task 13
    let promise = new Promise((resolve, reject) => {
        const title = req.params.title;
        let titleBooks = Object.values(books).filter(book => book.title == title);
        retrieved = JSON.stringify(titleBooks,null,4)

        if (retrieved) {
            res.send(retrieved);
            resolve('Retrieved data successfully');
        } else {
            reject('Somethingh went wrong.');
        }
    });
    
    promise.then(result => {
            console.log(result); // This will run if the Promise is fulfilled
        })
        .catch(error => {
            console.error(error); // This will run if the Promise is rejected
        })
        .finally(() => {
            console.log('The promise has completed'); // This will run when the Promise is settled
    });

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
