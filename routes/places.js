const express = require('express')
const Place = require('../models/place');

// controler 
const PlaceController = require('../controllers/place')

const wrapAsync = require('../utils/wrapAsync')
const isValidObjectId = require('../middlewares/isValidObjectId')
const isAuth = require('../middlewares/isauth')
const { isAuthorPlace } = require('../middlewares/isAuthor');
const { validatePlace } = require('../middlewares/validator');
const { post } = require('./reviews');
const upload = require('../config/multer');


const router = express.Router();

router.route('/')
    .get(wrapAsync (PlaceController.index))
    // .post(isAuth,validatePlace, wrapAsync (PlaceController.store))
    // .post(isAuth,upload.array('image',5),(req,res)=>{
            .post(isAuth,upload.array('image',5),validatePlace, wrapAsync (PlaceController.store))

router.get('/create',isAuth,(req,res)=>{
    res.render('places/create')
})

router.route('/:id')
    .get(isValidObjectId('/places'),wrapAsync (PlaceController.show))
    .put(isAuth,isAuthorPlace,isValidObjectId('/places'),upload.array('image',5),validatePlace, wrapAsync (PlaceController.update ))
    .delete(isAuth,isAuthorPlace,isValidObjectId('/places'),wrapAsync (PlaceController.destroy))

router.get('/:id/edit',isAuth,isAuthorPlace,isValidObjectId('/places'),wrapAsync (PlaceController.edit))

module.exports = router;