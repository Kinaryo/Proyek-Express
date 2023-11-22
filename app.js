const ejsMate = require('ejs-mate')
const express = require('express')
const ErrorHandler= require('./utils/ErrorHandler')
const methodOverride = require('method-override')
const path = require('path')
const app = express();
const mongoose = require('mongoose')
const wrapAsync = require('./utils/wrapAsync')



// stage 2 penambahan models 
const Place = require('./models/place');

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

app.post('/places', wrapAsync (async(req,res,next)=>{
    try{
    const place = new Place(req.body.place)
    await place.save();
    res.redirect('/places')
    }
    catch (error){
        next(error)
    }
}))

app.get('/places/:id',wrapAsync (async(req,res)=>{
    const {id} = req.params
    const place = await Place.findById(id)
    res.render('places/show',{place})
}))

app.get('/places/:id/edit',wrapAsync (async(req,res)=>{
        const {id} = req.params
    const place = await Place.findById(id)
    res.render('places/edit',{place})
}))

app.put('/places/:id', wrapAsync (async(req,res)=>{
const place = await Place.findByIdAndUpdate(req.params.id,{...req.body.place})
res.redirect('/places')
}))


app.delete('/places/:id', wrapAsync (async (req,res)=>{
    await Place.findByIdAndDelete(req.params.id)
    res.redirect('/places')
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