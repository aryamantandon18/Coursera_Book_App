const express = require('express');
const { getBooks, getBookByISBN, addReview, deleteReview, createBooks, getBookByAuthor, getBookReviews, getBookByTitle } = require('../controllers/bookController');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', getBooks);
router.post('/createBooks',createBooks);
router.get('/:isbn', getBookByISBN);
router.post('/getBookByAuthor',getBookByAuthor);
router.post('/getBookByTitle',getBookByTitle);
router.post('/review', authenticate, addReview);
router.post('/getBookReviews',authenticate,getBookReviews);
router.delete('/review', authenticate, deleteReview);

module.exports = router;
