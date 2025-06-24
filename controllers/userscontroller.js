const User = require('../models/user.js');

module.exports.signup=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.postSignup=(async(req,res,next)=>{
    try{
    let{username,email,password}=req.body;
    const newuser= new User({username,email});
    const registeruser= await User.register(newuser,password);
    console.log(registeruser);
    req.login(registeruser,(err)=>{
        if(err){
            return next(err);
        }else{
         req.flash("success","User SignedIn successfully");
         res.redirect("/listings");
        }
    })
   
    }catch(e){
        req.flash("error",e.message);
        res.redirect('/signup');
    }
});

module.exports.login=(req,res)=>{
     res.render("users/login.ejs");
};

module.exports.postLogin=(req,res)=>{
    req.flash("success","You are logged In successfully");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.postLogout=async(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }else{
            req.flash("success","You are logged Out successfully");
            res.redirect("/listings");
        }
    })
    };