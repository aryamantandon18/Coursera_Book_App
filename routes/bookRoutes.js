const express = require('express');
const { getBooks, getBookByISBN, addReview, deleteReview, createBooks, getBookByAuthor } = require('../controllers/bookController');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', getBooks);
router.post('/createBooks',createBooks);
router.get('/:isbn', getBookByISBN);
router.post('/getBookByAuthor',getBookByAuthor);
router.post('/review', authenticate, addReview);
router.delete('/review/:reviewId', authenticate, deleteReview);

module.exports = router;
