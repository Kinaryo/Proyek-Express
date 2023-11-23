const ejsMate = require('ejs-mate')
const express = require('express')
const ErrorHandler= require('./utils/ErrorHandler')
const Joi = require('joi')
const methodOverride = require('method-override')
const path = require('path')
const app = express();
const mongoose = require('mongoose')
const wrapAsync = require('./utils/wrapAsync')



// stage 2 penambahan models 
const Place = require('./models/place');
const Review = require('./models/review')

const {placeSchema} = require('./schemas/place')
const {reviewSchema} =require('./schemas/review')

// function connect to mongodb
mongoose.connect('mongodb://127.0.0.1/bestpoints').then((result)=>{
    console.log ('connected to mongodb')
}).catch((err)=>{
    console.log(err)
})

app.engine('ejs',ejsMate)
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))



//mildware untuk mendapatkan data dari body;
app.use(express.urlencoded({extended:true}))
// untuk mengubah method post menjadi method yang kita ingkinkan melalui query parameter 
app.use(methodOverride('_method'));


const validatePlace = (req,res,next) =>{
    const {error}= placeSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el=>el.message).join(',')
        return next(new ErrorHandler(msg,400))
    }else{
        next();
    }
}

const validateReview = (req,res,next) =>{
    const {error}= reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el=>el.message).join(',')
        return next(new ErrorHandler(msg,400))
    }else{
        next();
    }
}





app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/places', wrapAsync (async (req, res) => {
    const places = await Place.find();
    res.render('places/index', { places });
}))

app.get('/places/create',(req,res)=>{
    res.render('places/create')
})

app.post('/places',validatePlace, wrapAsync (async(req,res,next)=>{
    const place = new Place(req.body.place)
    await place.save();
    res.redirect('/places')
}))

app.get('/places/:id',wrapAsync (async(req,res)=>{
    const {id} = req.params
    const place = await Place.findById(id).populate('reviews')
    res.render('places/show',{place})
}))

app.get('/places/:id/edit',wrapAsync (async(req,res)=>{
        const {id} = req.params
    const place = await Place.findById(id)
    res.render('places/edit',{place})
}))

app.put('/places/:id',validatePlace, wrapAsync (async(req,res)=>{
const place = await Place.findByIdAndUpdate(req.params.id,{...req.body.place})
res.redirect('/places')
}))


app.delete('/places/:id', wrapAsync (async (req,res)=>{
    await Place.findByIdAndDelete(req.params.id)
    res.redirect('/places')
}))

// comments iniiiiiii
app.post('/places/:id/reviews',validateReview, wrapAsync(async (req,res)=>{
    const review = new Review(req.body.review);
    const place = await Place.findById(req.params.id)
    place.reviews.push(review)
    await review.save();
    await place.save()
    res.redirect(`/places/${req.params.id}`)
}))

// hapus koment 
app.delete('/places/:place_id/reviews/:review_id', wrapAsync(async(req,res)=>{
    const {place_id,review_id} = req.params;
    await Place.findByIdAndUpdate(place_id,{$pull: {reviews: { _id:review_id}}});
    await Review.findByIdAndDelete(review_id)
    res.redirect(`/places/${place_id}`);
}))





app.all('*',(req,res,next)=>{
    next(new ErrorHandler('page not found', 404))
})

app.use((err,req,res,next)=>{
    const {statusCode = 500 } = err;
   if(!err.message) err.message = "Oh no, something went wrong!"
   res.status(statusCode).render('error',{err})
})
// app.get('/seed/place',async(req,res)=>{
//     const place = new Place({
//         title : 'empire state building',
//         price :'$9999999',
//         description : 'A great building',
//         location: 'new York, NY'
//      })
//     await place.save();
//     res.send(place);
// })
app.listen(3000,()=>{
console.log ( 'server berjalan di http://127.0.0.1:3000')
})