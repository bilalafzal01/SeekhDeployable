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
var MCQ         = db.MCQ;
//node app usages
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use(express.static(__dirname+"/public"));
app.use(passport.initialize());
app.use(passport.session());
app.use(session({secret: 'mySecret', resave: false, saveUninitialized: false}));
app.set("view engine","ejs");

var tempUsername;
//routes
//to get the current user in the session: req.session.user

app.get("/",function(req,res){
  var tempUser = req.session.user;

  var randomNumber = Math.floor((Math.random() * 2) + 1);

  db.MCQ.findOne({
    where: {mcqID: randomNumber}
  }).then(function(mcqOfTheDay){
    res.render("main", {currentUser: tempUser, mcq: mcqOfTheDay});
  }).catch(function(err){
    console.log(err);
    res.render("main", {currentUser: tempUser});
  });
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
  tempUsername = tempUser.username;
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
        tempUsername = req.body.username;  
        res.render("profileSetup",{newUser: newUser.dataValues});
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
  //var tempUser = req.session.user;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var desc = req.body.description;
  var phoneNum = req.body.phoneNumber;
  //console.log("tempuser here is: ");
  console.log(req.session.user);
  db.User.findOne({
    where: {username: tempUsername}
  })
  .then(function(userInDB){
    userInDB.update({
      firstName: firstName,
      lastName: lastName,
      description: desc,
      phoneNumber: phoneNum
    });
    // console.log(userInDB.dataValues);
    req.session.user = userInDB;
    res.redirect("/dashboard");
  })
  .catch(function(err){
    res.redirect("/register");
  });
});
  
app.get("/courses/:Courseid", function(req,res,next){
    if(!req.session.user){
        res.redirect("/");
    }else{
        db.Courses.findByPk(req.params.Courseid).then((course)=>{
          db.EnrolledCourses.findOne({
            where: {courseID: course.course_id, userID: req.session.user.id}
          }).then((enrolled)=>{
            res.render("course", {course: course, currentUser: req.session.user, enrolled: enrolled});
          }).catch((err)=>{
            res.render("course", {course: course, currentUser: req.session.user});
          });
        }).catch((err)=>{
            res.redirect("/");
        });    
    }
}); 

app.get("/enroll/:course",(req,res)=>{
  let course  = req.params.course;
  let user    = req.session.user;
  // console.log(user);
  // console.log(course);
  db.EnrolledCourses.create({
    userID: user.id,
    courseID: course
  }).then(()=>{
    res.redirect("/");
  }).catch((err)=>{
    console.log(err);
    res.redirect("/register");
  });

});

app.get("/dashboard/:courseID",(req,res)=>{
  let course_id  = req.params.courseID;
  let user    = req.session.user;
  var subs = [];
  var i = 0;
  db.Courses.findOne({
    where: {course_id: course_id}
  }).then((course)=>{
    db.EnrolledCourses.findOne({
      where: {courseID: course.course_id, userID: req.session.user.id}
    }).then((enrolled)=>{
      db.CourseSubject.findAll({
        where: {courseID: course.course_id}
      }).then((arrayOfCourseSubjects)=>{
        console.log("reached here");
        // console.log(arrayOfCourseSubjects);
        // console.log("length of array is: " +arrayOfCourseSubjects.length);
        arrayOfCourseSubjects.forEach((subject)=>{
          console.log("in for loop! ");
          // console.log(subject);
          db.Subject.findOne({
            where: {subjectID: subject.dataValues.subjectID}
          }).then((oneSubject)=>{
            i++;
            // console.log(oneSubject.dataValues.subjectName);
            subs.push({subjectID: oneSubject.dataValues.subjectID, subjectName: oneSubject.dataValues.subjectName});
            console.log(subs);
            // subs.push(oneSubject.dataValues);
            if(i == arrayOfCourseSubjects.length){
              res.render("courseDashboard",{course: course, currentUser: user, enrolled: enrolled, subjects: subs});          
            }
          }).catch((err)=>{
            console.log("no subjects found!");
            console.log(err);
          });
        });
          // console.log("here now!");   
      }).catch((err)=>{
        console.log("could notfind subjects!");
        res.render("courseDashboard",{course: course, currentUser: user, enrolled: enrolled});
      });
    }).catch((error)=>{
      console.log("user not enrolled");
      res.redirect("/courses/"+course_id);
    });
  }).catch((err)=>{
    console.log("course not found");
    res.redirect("/register");
  });

});

app.get("/course/:courseID/subject/:subjectID", (req,res)=>{
  let courseID  = req.params.courseID,
      subjectID = req.params.subjectID;
  let user  = req.session.user;
  let i = 0;
  db.Courses.findOne({
    where: {course_id: courseID}
  }).then((course)=>{
    db.EnrolledCourses.findOne({
      where: {courseID: course.dataValues.course_id, userID: user.id}
    }).then((enrolled)=>{
      db.Subject.findOne({
        where: {subjectID: subjectID}
      }).then((subject)=>{
        db.Chapter.findAll({
          where: {subjectID: subject.subjectID}
        }).then((arrayOfChapters)=>{
          let chaps = [];
          let topics = [];
          arrayOfChapters.forEach((chapter)=>{
            i++;
            chaps.push({chapterID: chapter.dataValues.chapterID, chapterName: chapter.dataValues.chapterName});
            db.Topic.findAll({
              where: {subjectID: subject.subjectID}
            }).then((arrayOfTopics)=>{
              arrayOfTopics.forEach((topic)=>{
                i++;
                topics.push({topicID: topic.topicID, topicName: topic.topicName, chapterID: topic.chapterID});
              });
              if(i == arrayOfChapters.length+arrayOfTopics.length){
                res.render("subjectDashboard",{subject: subject, chapters: chaps, topics: topics, currentUser: req.session.user});
              }
            }).catch((topicERR)=>{
              console.log(topicERR);
            });
          });  
        }).catch((chapterERR)=>{
          console.log(chapterERR);
        });
      }).catch((subjectERR)=>{
        console.log(subjectERR);
      });
    }).catch((enrollERR)=>{
      console.log(enrollERR);
    });
  }).catch((courseERR)=>{
    console.log(courseERR);
  });
  
});

//run server
db.sequelize.sync().then(function() {
    app.listen(PORT, function() {
      console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
    });
});