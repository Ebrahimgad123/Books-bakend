const { Router } = require("express");
const router = Router();
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs
const { Books, validateBook, validateUpdateBook } = require("../model/Books");
const asyncHandler = require("express-async-handler");
const { verifyTokensAndAdmin } = require("../middlewares/verfiyToken");
/** 
    @desc  Gel All Books
   @route  /api/books
   @method  Get
   @access  public
**/
router.get('/books', asyncHandler(async (req, res) => {
  try {
    const books = await Books.find().populate("author");
    res.json(books);
  } catch (error) {
    res.status(500).send(error.message);
  }
}));
/** 
    @desc  Get book by Id
   @route  /api/books/:id
   @method  Get
   @access  public
**/
router.get('/books/:id', asyncHandler(async (req, res) => {
    const book = await Books.findById(req.params.id).populate("author");
    if (!book) {
      return res.status(404).send('Book not found');
    }
    res.json(book);

}));

/** 
    @desc  Delete book by Id
   @route  /api/books/:id
   @method  Delete
   @access  private (only admin can delete)
**/
router.delete('/books/:id',verifyTokensAndAdmin, asyncHandler(async (req, res) => {
    const book = await Books.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).send('Book not found');
    }
    res.json(book);
}));

/** 
    @desc  Create New book
   @route  /api/books
   @method  Post
   @access  private (only admin can Create)
**/
router.post('/books',verifyTokensAndAdmin, asyncHandler(async (req, res) => {
  const { error } = validateBook(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
    const newBook = new Books({ id: uuidv4(), ...req.body });
    await newBook.save();
    res.status(201).json(newBook)
}));
/** 
    @desc  Update book
   @route  /api/books/:id
   @method  Put
   @access  private (only admin can Update)
**/
router.put('/books/:id',verifyTokensAndAdmin, asyncHandler(async (req, res) => {
  const { error } = validateUpdateBook(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
    const updatedBook = await Books.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBook) {
      return res.status(404).send('Book not found');
    }
    res.json(updatedBook);
}));

module.exports = router;
