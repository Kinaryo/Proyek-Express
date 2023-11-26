module.exports=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash('error_msg','You are not Logged in');
        res.redirect('/login')
    }
    next();
}