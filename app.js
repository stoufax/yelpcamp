var express               = require("express"),
    app                   = express(),
    bodyParser            = require("body-parser"),
    mongoose              = require("mongoose"),
    flash                 = require("connect-flash"),
    passport              = require("passport"),
    passportStrategy      = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    methodOverride        = require('method-override'),
    Campground            = require("./models/campgrounds"),
    Comment               = require("./models/comment"),
    User                  = require("./models/user");
 
var indexRoutes      = require("./routes/index"),
    commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    permisionRoutes  = require("./routes/404notfound");
    
var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";    
  
mongoose.connect(url);   
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());

// Passport Configuration
app.use(require("express-session")({
    secret : "this is my first app",
    resave : false,
    saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error       = req.flash("error");
    res.locals.success     = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/",permisionRoutes);


app.listen(process.env.PORT, process.env.IP,function(){
   console.log("Server has started"); 
});