var express     = require('express');
var app         = express();
var bodyparser  = require('body-parser');
var session     = require("express-session");

// Requiring path to so we can use relative routes to our HTML files
var path = require("path");

// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("./config/middleware/isAuthenticated");

// Setting up port
var PORT        = process.env.PORT || 8080;
var db          = require('./models');
var passport    = require("./config/passport");

//node app usages
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use(express.static(__dirname+"/public"));
app.use(passport.initialize());
app.use(passport.session());
app.use(session({secret: 'mySecret', resave: false, saveUninitialized: false}));
app.set("view engine","ejs");

//routes
//to get the current user in the session: req.session.user

app.get("/",function(req,res){
  var tempUser = req.session.user;
  res.render("main", {currentUser: tempUser});
});

app.get("/leaderboards",function(req,res){
  var tempUser = req.session.user;
  res.render("leaderboards", {currentUser: tempUser});
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/login",passport.authenticate("local"),(req,res)=>{
  req.session.user =  req.user.dataValues;
  tempUser = req.user.dataValues;
  res.redirect("/dashboard");  

});

app.get("/dashboard",(req,res)=>{
  var userSession = req.session.user;
  db.Courses.findAll().then((courses)=>{
    if(!userSession){
      res.redirect("/");
    }else{
      res.render("dashboard", {currentUser: userSession, course: courses});
    }
  }).catch((err)=>{
    console.log(err);
  });
  
});


app.post("/register",function(req,res){
  db.User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
  }).then(function(){
      db.User.findOne({
        where: {email: ''+req.body.email}
      }).then(function(newUser){
        res.render("profileSetup",{user: newUser.dataValues});
      }).catch(function(){
        console.log("Could not find user!");
      });
      
  }).catch(function(err) {
      console.log("error here is: "+err);
      res.json(err);
  });
});
app.get('/logout', function (req, res){
  req.session.destroy(function (err) {
    res.redirect('/');
  });
});

app.get("/user_data", function(req, res) {
  if (!req.user) {
    res.json({});
  }
  else {
    res.json({
      email: req.user.email,
      id: req.user.id
    });
  }
});

app.get('/profileSetup',(req,res)=>{
  var tempUser = req.session.user;
  res.render("profileSetup",{newUser: tempUser});
});

app.post('/profileSetup',function(req,res){
  var tempUser = req.session.user;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var desc = req.body.description;
  var phoneNum = req.body.phoneNumber;
  db.User.findOne({
    where: {username: tempUser.username}
  })
  .then(function(userInDB){
    userInDB.update({
      firstName: firstName,
      lastName: lastName,
      description: desc,
      phoneNumber: phoneNum
    });
    console.log(userInDB.dataValues);
    req.session.user = userInDB;
    res.redirect("/dashboard");
  })
  .catch(function(err){
    res.redirect("/register");
  });
});
  

//run server
db.sequelize.sync().then(function() {
    app.listen(PORT, function() {
      console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
    });
});