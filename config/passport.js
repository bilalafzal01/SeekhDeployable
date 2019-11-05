var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var db = require("../models");

passport.use(new LocalStrategy(
    {
        usernameField: "email"
    },
    function(email,password,done){
        db.User.findOne({
            where:{
                email: email
            }
        }).then(function(dbUser){
            if(!dbUser){
                console.log("user not found");
                return done(null, false,{
                    message: "Incorrect email."
                });
            }
            else if(!dbUser.validPassword(password)){
                console.log("wrong pass");                
                return done(null, false, {
                    message: "Incorrect password."
                });
            }
            // console.log("here in passportjs the user is:");
            // console.log(dbUser);
            return done(null, dbUser);
        });
    }
));

passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});
  //
  // Exporting our configured passport
module.exports = passport;