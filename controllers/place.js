const place = require('../models/place');
const Place = require('../models/place')

module.exports.index = async (req, res) => {
    const places = await Place.find();
    res.render('places/index', { places });
}

module.exports.store = async(req,res,next)=>{
    const images = req.files.map(file => ({
        url : file.path,
        filename: file.filename
    }))
    const place = new Place(req.body.place)
    place.author = req.user._id
    place.images = images;
    await place.save();
    req.flash('success_msg','Place added successfully')
    res.redirect('/places')
}


module.exports.show = async(req,res)=>{
    const {id} = req.params
    const place = await Place.findById(id)
    .populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    })
    .populate('author')
    console.log(place)
    res.render('places/show',{place})
}

module.exports.edit = async(req,res)=>{
    const {id} = req.params
const place = await Place.findById(id)
res.render('places/edit',{place})
}

module.exports.update = async(req,res)=>{
    await Place.findByIdAndUpdate(req.params.id,{...req.body.place})
    req.flash('success_msg','Selamat, Data berhasil di perbarui')
    res.redirect('/places')
    }

module.exports.destroy = async (req,res)=>{
    await Place.findByIdAndDelete(req.params.id)
    req.flash('success_msg','Selamat, Data berhasil di Hapus')
    res.redirect('/places')
}