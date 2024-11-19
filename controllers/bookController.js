const Book = require('../models/Book');
const Review = require('../models/Review');

exports.createBooks = async(req,res) =>{
    try {
        const books = req.body; // Array of book objects

        if (!Array.isArray(books)) {
            return res.status(400).json({ message: "The request body must be an array of books." });
        }

        // Insert books in bulk
        const createdBooks = await Book.insertMany(books);
        res.status(201).json({
            message: "Books created successfully",
            data: createdBooks,
        });
    } catch (error) {
        if (error.code === 11000) {
            // Handle duplicate ISBN error
            res.status(400).json({
                message: "Duplicate ISBN detected. Ensure each book has a unique ISBN.",
                error: error.message,
            });
        } else {
            res.status(500).json({
                message: "Failed to create books",
                error: error.message,
            });
        }
    }
}
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find().populate('reviews');
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getBookByISBN = async (req, res) => {
  try {
    const { isbn } = req.params;
    const book = await Book.findOne({ isbn }).populate('reviews');
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getBookByAuthor = async(req,res) =>{
    try {
        const {author} = req.body;
        const books = await Book.find({author});
        if(!books) return res.status(404).json({error: 'Book not found'})
         res.status(200).json({success:true,Books_By_Author:books});   
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
exports.addReview = async (req, res) => {
  try {
    const { bookId, content } = req.body;
    const review = new Review({ user: req.user._id, book: bookId, content });
    await review.save();
    await Book.findByIdAndUpdate(bookId, { $push: { reviews: review._id } });
    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findOne({ _id: reviewId, user: req.user._id });
    if (!review) return res.status(403).json({ error: 'Unauthorized' });
    await review.remove();
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
