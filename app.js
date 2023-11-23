const ejsMate = require('ejs-mate')
const express = require('express')
const ErrorHandler= require('./utils/ErrorHandler')
const methodOverride = require('method-override')
const path = require('path')
const app = express();
const mongoose = require('mongoose')
const wrapAsync = require('./utils/wrapAsync')





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
app.use('/places',require('./routes/places'))
app.use('/places/:place_id/reviews', require('./routes/reviews'))


// comments iniiiiiii






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