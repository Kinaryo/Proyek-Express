// stage 2 penambahan models 
const express = require('express')
const Place = require('../models/place');
const Review = require('../models/review')
const ReviewsControler = require('../controllers/reviews')
const {reviewSchema} =require('../schemas/review')
const wrapAsync = require('../utils/wrapAsync')
const ErrorHandler= require('../utils/ErrorHandler')
const isValidObjectId = require('../middlewares/isValidObjectId')
const isAuth = require('../middlewares/isauth')
const {isAuthorReview} = require('../middlewares/isAuthor')

const router = express.Router({mergeParams : true});

const validateReview = (req,res,next) =>{
    const {error}= reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el=>el.message).join(',')
        return next(new ErrorHandler(msg,400))
    }else{
        next();
    }
}


router.post('/',isAuth,isValidObjectId('/places'),validateReview, wrapAsync(ReviewsControler.store))

// hapus koment 
router.delete('/:review_id',isAuthorReview,isAuth,isValidObjectId('/places'), wrapAsync(ReviewsControler.destroy))


module.exports = router;