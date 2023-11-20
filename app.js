const express = require('express')
const path = require('path')
const app = express();
const mongoose = require('mongoose')


// stage 2 penambahan models 
const Place = require('./models/place');
const place = require('./models/place');

// function connect to mongodb
mongoose.connect('mongodb://127.0.0.1/bestpoints').then((result)=>{
    console.log ('connected to mongodb')
}).catch((err)=>{
    console.log(err)
})

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))


app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/seed/place',async(req,res)=>{
    const place = new Place({
        title : 'empire state building',
        price :'$9999999',
        description : 'A great building',
        location: 'new York, NY'
     })
    await place.save();
    res.send(place);
})
app.listen(3000,()=>{
console.log ( 'server berjalan di http://127.0.0.1:3000')
})