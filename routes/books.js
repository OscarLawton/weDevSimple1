const express = require("express");
const router = express.Router();
const Book = require('../models/book');
const Author = require('../models/author');

// All Books Route
router.get("/", async function(req, res){
    res.send("All books");
});

// New Book Route
router.get("/new", async function(req, res){
    try{
        const authors = await Author.find({});
        const book = new Book();
        res.render("books/new", {
            authors: authors,
            book: book
        });
    } catch {
        res.redirect('/');
    }
    
});

// Create Book Route
router.post("/", async function(req, res){
    res.send("Create Book");
});

module.exports = router;