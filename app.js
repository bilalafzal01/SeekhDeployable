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

app.get("/errorPage",(req,res)=>{
  res.render("errorPage");
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
                res.render("subjectDashboard",{subject: subject, chapters: chaps, topics: topics, currentUser: req.session.user, course: course});
              }
            }).catch((topicERR)=>{
              res.redirect("/errorPage");
              console.log(topicERR);
            });
          });  
        }).catch((chapterERR)=>{
          res.redirect("/errorPage");
          console.log(chapterERR);
        });
      }).catch((subjectERR)=>{
        res.redirect("/errorPage");
        console.log(subjectERR);
      });
    }).catch((enrollERR)=>{
      res.redirect("/errorPage");
      console.log(enrollERR);
    });
  }).catch((courseERR)=>{
    res.redirect("/errorPage");
    console.log(courseERR);
  });
  
});

//Post Requests For forms

app.get('/formschapters', function(req,res){
  if(!req.session.user){
    res.redirect("/errorPage");
  }else{
    if(req.session.user.id == 7){
      res.render('formschapters');
    }else{
      res.redirect("/errorPage");
    }
  }
});

app.post('/formschapters', function(req,res){
  let chapterName = req.body.ChapterName;
  let subjectName = req.body.subjectName;

  db.Subject.findOne({
    where: {subjectName: subjectName}
  }).then((subject)=>{
    let subjectID = subject.dataValues.subjectID;
    db.Chapter.create({
      chapterName: chapterName,
      subjectID:  subjectID
    }).then(()=>{
      console.log("created!");
      res.redirect("/formschapters");
    }).catch((err)=>{
      console.log(err);
      res.redirect("/");
    });
  }).catch((subjectERR)=>{
    console.log(subjectERR);
  });
});

app.get('/formscourses', function(req,res){
  if(!req.session.user){
    res.redirect("/errorPage");
  }else{
    if(req.session.user.id == 7){
      res.render('formscourses');
    }else{
      res.redirect("/errorPage");
    }
  }
});
app.post('/formscourses', (req,res)=>{
  db.Courses.create({
    title: req.body.title,
    fullForm: req.body.field,
    meritCriteriaMatric: req.body.meritCriteriaMatric,
    meritCriteriaFSC: req.body.meritCriteriaFsc,
    meritCriteriaTest:req.body.meritCriteriaTest,
    description: req.body.description,
    field: req.body.field
  }).then(()=>{
    console.log("Added to Courses");
    res.redirect("/formscourses");
  }).catch((err)=>{
    console.log(err);
    res.redirect("/");
  });
});

app.get('/formssubjects', function(req,res){
  if(!req.session.user){
    res.redirect("/errorPage");
  }else{
    if(req.session.user.id == 7){
      res.render('formssubjects');
    }else{
      res.redirect("/errorPage");
    }
  }
});

app.post('/formssubjects', (req,res)=>{
  console.log("subjectName:" + req.body.subjectName);
  console.log("subjectName:" + req.body.field);
  db.Subject.create({
    subjectName: req.body.subjectName,
    field: req.body.field
  }).then(()=>{
    console.log("created subject!");
    res.redirect("/formssubjects");
  }).catch((err)=>{
    console.log(err);
    res.redirect("/");
  });
});


app.get('/formsmcqs', function(req,res){
  if(!req.session.user){
    res.redirect("/errorPage");
  }else{
    if(req.session.user.id == 7){
      res.render('formsmcqs');
    }else{
      res.redirect("/errorPage");
    }
  }
});

app.post('/formsmcqs', (req,res)=>{
  let  statement = req.body.statement;
  let option1 = req.body.option1;
  let option2 = req.body.option2;
  let option3 = req.body.option3;
  let option4 = req.body.option4;
  let correctAns=req.body.correctAns;
  let topicName=req.body.topicName;
  let chapterName=req.body.chapterName;
  let subjectName=req.body.subjectName;
  let mcqNumber=req.body.mcqNumber;
  db.Subject.findOne({
    where: {subjectName: subjectName}
  }).then((subject)=>{
    let subjectID = subject.dataValues.subjectID;
    db.Chapter.findOne({
      where:{chapterName:chapterName}
    }).then((chapterrow)=>{
      let chapterID=chapterrow.dataValues.chapterID;
      db.Topic.findOne({
        where:{topicName:topicName}
      }).then((topicrow)=>{
        let topicID=topicrow.dataValues.topicID;
        db.MCQ.create({
          statement:  statement,
          option1:    option1,
          option2:    option2,
          option3:    option3,
          option4:    option4,
          correctAns: correctAns,
          topicID:    topicID,
          chapterID:  chapterID,
          subjectID:  subjectID,
          mcqNumber:  mcqNumber
        }).then(()=>{
          console.log("created!");
          res.redirect("/formsmcqs")})
          .catch((err)=>{
            console.log(err);
            res.redirect("/errorPage");
          });
        }).catch((topicerr)=>{
          console.log(topicerr);
          res.redirect("/errorPage");
        });
      }).catch((chapterERR)=>{
        console.log(chapterERR);
        res.redirect("/errorPage");
      });
    }).catch((subjecterr)=>{
      console.log(subjecterr);
      res.redirect("/errorPage");
    });
});
app.get('/formstopics', function(req,res){
  if(!req.session.user){
    res.redirect("/errorPage");
  }else{
    if(req.session.user.id == 7){
      res.render('formstopics');
    }else{
      res.redirect("/errorPage");
    }
  }
});
  
app.post('/formstopics', (req,res)=>{
  let topicName=req.body.topicName;
  let subjectName=req.body.subjectName;
  let chapterName=req.body.chapterName;
  db.Subject.findOne({
    where: {subjectName: subjectName}
  }).then((subject)=>{
    let subjectID = subject.dataValues.subjectID;
    db.Chapter.findOne({
      where:{chapterName:chapterName}
    }).then((chapterrow)=>{
      let chapterID=chapterrow.dataValues.chapterID;
        db.Topic.create({
          topicName:topicName,
          chapterID: chapterID,
          subjectID:  subjectID
        }).then(()=>{
          console.log("created!");
          res.redirect("/formstopics")})
          .catch((err)=>{
            console.log(err);
            res.redirect("/errorPage");
        });
      }).catch((chapterERR)=>{
        console.log(chapterERR);
        alert("No such chapter name found");
        res.redirect("/errorPage");
      });
    }).catch((subjecterr)=>{
      console.log(subjecterr);
      alert("No such subject name found");
      res.redirect("/errorPage");
    });
});
  
app.get('/formscoursessubjects', function(req,res){
  if(req.session.user.id == 7){
    res.render('formscoursessubjects');
  }else{
    res.redirect("/errorPage");
  }
});

app.post('/formscoursessubjects', (req,res)=>{
  let subjectName=req.body.subjectName;
  let title=req.body.courseTitle;
  db.Subject.findOne({
    where: {subjectName: subjectName}
  }).then((subjectrow)=>{
  let subjectID = subjectrow.dataValues.subjectID;
  db.Courses.findOne({
      where:{title:title}
    }).then((courserow)=>{
      let courseID=courserow.dataValues.courseID;
        db.CourseSubject.create({
        subjectID:subjectID,
        courseID: courseID
      }).then(()=>{
        console.log("created!");
        res.redirect("/formscoursessubjects")})
        .catch((err)=>{
          console.log(err);
          res.redirect("/errorPage");
      });
    }).catch((titleERR)=>{
      console.log(titleERR);
      alert("No such user name found");
      res.redirect("/errorPage");
    });
  }).catch((usererr)=>{
    console.log(usererr);
    alert("No such subject name found");
    res.redirect("/errorPage");
  });
});
    
app.get("/course/:courseID/subject/:subjectID/chapter/:chapterID/mcqPage", function(req,res){ 
  db.Courses.findOne({
    where: {course_id: req.params.courseID}
  }).then((course)=>{
    db.Subject.findOne({
      where: {subjectID: req.params.subjectID}
    }).then((subject)=>{
      db.Chapter.findOne({
        where: {chapterID: req.params.chapterID}
      }).then((chapter)=>{
        db.Topic.findAll({
          where : {subjectID: req.params.subjectID, chapterID: req.params.chapterID}
        }).then(function(topicsOfThatChapter){
          db.MCQ.findAll({
            where: {subjectID: req.params.subjectID, chapterID: req.params.chapterID}
          }).then((arrayOfMcqs)=>{
            res.render("mcqPage", {currentUser: req.session.user, mcqs: arrayOfMcqs, course: course, subject: subject, chapter: chapter, topics: topicsOfThatChapter});
          }).catch((topicsERR)=>{
            console.log(topicsERR);
            res.redirect("/errorPage");
          });
        }).catch(function(mcqERR){
          console.log(mcqERR);
          res.redirect("/errorPage");
        });
      }).catch((chapterERR)=>{
        console.log(chapterERR);
        res.redirect("/errorPage");
      });
    }).catch((subjectERR)=>{
      console.log(subjectERR);
      res.redirect("/errorPage");
    });
  }).catch((courseERR)=>{
    console.log(courseERR);
    res.redirect("/errorPage");
  });
});

//run server
db.sequelize.sync().then(function() {
    app.listen(PORT, function() {
      console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
    });
});