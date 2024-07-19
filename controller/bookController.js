const asyncHandler = require("express-async-handler");
const { Books, validateBook, validateUpdateBook } = require("../model/Books");
const { v4: uuidv4 } = require("uuid");

/**
 * @desc  get All Books
 * @route /api/books
 * @method Get
 * @access public
 **/
const getAllBooks = asyncHandler(async (req, res) => {
  try {
    const { pageNumber } = req.query;
    let booksPerPage = 4;
    let books;
    if (req.query.price) {
      books = await Books.find({ price: req.query.price }).populate("author", [
        "id",
        "firstName",
        "lastName",
        "nationality",
        "image",
      ]);
    } else {
      books = await Books.find()
        .populate("author", [
          "id",
          "firstName",
          "lastName",
          "nationality",
          "image",
        ])
        .skip((pageNumber - 1) * booksPerPage)
        .limit(booksPerPage);
    }
    res.json(books);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * @desc  get Book by id
 * @route /api/books/:id
 * @method Get
 * @access public
 **/
const getBookById = asyncHandler(async (req, res) => {
  const book = await Books.findById(req.params.id).populate("author");
  if (!book) {
    return res.status(404).send("book not found");
  }
  res.json(book);
});

/**
 * @desc  delete book byId
 * @route /api/books/:id
 * @method Delete
 * @access private (only admin can delete book)
 **/
const deleteBookByID = asyncHandler(async (req, res) => {
  const book = await Books.findByIdAndDelete(req.params.id);
  if (!book) {
    return res.status(404).send("book not found");
  }
  res.json(book);
});

/**
 * @desc  Create new book
 * @route /api/books
 * @method Post
 * @access private (only admin can create new book)
 **/

const createNewBook = asyncHandler(async (req, res) => {
  const { error } = validateBook(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const newBook = new Books({ id: uuidv4(), ...req.body });
  await newBook.save();
  res.status(201).json(newBook);
});

const UploadBooks = asyncHandler(async (req, res) => {
  const { error } = validateBook(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const imageUrl = `http://localhost:3000/images/${req.file.filename}`;
  const newBook = new Books({ ...req.body, coverImage: imageUrl });
  await newBook.save();
  res.status(201).json(newBook);
});

/**
 * @desc  update book
 * @route /api/books/:id
 * @method Put
 * @access private (only admin can update)
 **/
const updateBook = asyncHandler(async (req, res) => {
  const { error } = validateUpdateBook(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const updatedBook = await Books.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!updatedBook) {
    return res.status(404).send("book not found");
  }
  res.json(updatedBook);
});

module.exports = {
  getAllBooks,
  getBookById,
  deleteBookByID,
  createNewBook,
  updateBook,
  UploadBooks,
};
