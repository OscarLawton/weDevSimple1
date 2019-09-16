const express = require("express");
const router = express.Router();
const Book = require('../models/book');
const Author = require('../models/author');


const imageMimeTypes = ['image/jpeg', "image/png", "images/gif"];

// All Books Route
router.get("/", async function(req, res){
    let query = Book.find()
    if(req.query.title != null && req.query.title != ""){
        query = query.regex('title', new RegExp(req.query.title, 'i'));
        
    }
    if(req.query.publishedBefore != null && req.query.publishedBefore != ""){
        query = query.lte('publishDate', req.query.publishedBefore);
    }
    if(req.query.publishedAfter != null && req.query.publishedAfter != ""){
        query = query.gte('publishDate', req.query.publishedAfter);
        
    }
    try{
        const books = await query.exec();
        
        res.render("books/index", {
            books: books,
            searchOptions: req.query
        })
    } catch(e) {
        console.error(e);
        res.redirect("/");
    }
   
});

// New Book Route
router.get("/new", async function(req, res){
   renderNewPage(res, new Book());
    
});

// Create Book Route
router.post("/", async function(req, res){
   
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description
    });
    
    saveCover(book, req.body.cover)
    try{
        const newBook = await book.save();
        res.redirect('books');
    } catch(e) {
        console.error(e);
        
        renderNewPage(res, book, true);
    }
});
function saveCover(book, coverEncoded){
    if(coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if(cover != null && imageMimeTypes.includes(cover.type)){
        book.coverImage = new Buffer.from(cover.data, "base64"),
        book.coverImageType = cover.type
    }
}

async function renderNewPage(res, book, hasError = false){
    try{
        const authors = await Author.find({});
        const params = {
            authors: authors,
            book: book
        }
        if(hasError) params.errorMessage = "there was an error creating book";
        res.render("books/new", params);
    } catch(e) {
        console.log(e);
        res.redirect('/books');
    }
}
module.exports = router;