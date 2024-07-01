const { Router } = require("express");
const { v4: uuidv4 } = require("uuid"); // For generating unique IDs
const router = Router();
const asyncHandler = require("express-async-handler");
const {Authors,validateAuthor,validateUpdateAuthor} = require("../model/authors");
const { verifyTokensAndAdmin } = require("../middlewares/verfiyToken");

/** 
    @desc  Get All Authors
   @route  /api/authors
   @method  Get
   @access  public 
**/
router.get(
  "/authors",
  asyncHandler(async (req, res) => {
    const authors = await Authors.find().sort({ firstName: 1 });
    res.json(authors);
  })
);
/** 
    @desc  Get author By id
   @route  /api/authors/:id
   @method  Get
   @access  public 
**/
router.get(
  "/authors/:id",
  asyncHandler(async (req, res) => {
    const author = await Authors.findById(req.params.id);
    if (!author) {
      return res.status(404).send("Author not found");
    }
    res.json(author);
  })
);
/** 
    @desc  Delete author By id
   @route  /api/authors/:id
   @method  Delete
   @access  private(only admin can delete author) 
**/
router.delete(
  "/authors/:id",verifyTokensAndAdmin,
  asyncHandler(async (req, res) => {
    const author = await Authors.findByIdAndDelete(req.params.id);
    if (!author) {
      return res.status(404).send("Author not found");
    }
    res.json(author);
  })
);


/** 
    @desc  Create Author
   @route  /api/authors
   @method  Post
   @access  public (only admin can create new author)
**/
router.post(
  "/authors",verifyTokensAndAdmin,
  asyncHandler(async (req, res) => {
    const { error } = validateAuthor(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const newAuthor = new Authors({ ...req.body, id: uuidv4() });
    await newAuthor.save();
    res.status(201).json(newAuthor);
  })
);


/** 
    @desc  update author
   @route  /api/authors/:id
   @method  Put
   @access  private (only admin can update author) 
**/
router.put(
  "/authors/:id",verifyTokensAndAdmin,
  asyncHandler(async (req, res) => {
    const { error } = validateUpdateAuthor(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const updatedAuthor = await Authors.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedAuthor) {
      return res.status(404).send("Author not found");
    }
    res.json(updatedAuthor);
  })
);

module.exports = router;
