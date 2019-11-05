var express = require('express');
var app = express();
var bodyparser  = require('body-parser');
var path = require("path");
var session     = require("express-session");
app.use(session({secret: 'mySecret', resave: false, saveUninitialized: false}));

var PORT        = process.env.PORT || 8080;
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use(express.static(__dirname+"/public"));
app.use(passport.initialize());
app.use(passport.session());
app.set("view engine","ejs");

app.listen(PORT, function(){
    console.log("running");
});