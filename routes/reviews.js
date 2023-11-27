// stage 2 penambahan models 
const express = require('express')
const Place = require('../models/place');
const Review = require('../models/review')
const ReviewsControler = require('../controllers/reviews')
const wrapAsync = require('../utils/wrapAsync')

const isValidObjectId = require('../middlewares/isValidObjectId')
const isAuth = require('../middlewares/isauth')
const {isAuthorReview} = require('../middlewares/isAuthor')
const { validateReview } = require('../middlewares/validator')
const router = express.Router({mergeParams : true});

router.post('/',isAuth,isValidObjectId('/places'),validateReview, wrapAsync(ReviewsControler.store))

// hapus koment 
router.delete('/:review_id',isAuthorReview,isAuth,isValidObjectId('/places'), wrapAsync(ReviewsControler.destroy))


module.exports = router;