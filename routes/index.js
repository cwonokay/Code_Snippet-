const express = require("express");
const router = express.Router();
const app = express();
const Snippet = require("../models/snippet");
const User = require("../models/user");
const mongoose = require("mongoose");
const passport = require('passport');
mongoose.connect("mongodb://localhost:27017/snippet");

// let data =[];

const requireLogin = function (req, res, next) {
  if (req.user) {
    console.log(req.user)
    next()
  } else {
    res.redirect('/');
  }
};

const login = function (req, res, next) {
  if (req.user) {
    res.redirect("/profile")
  } else {
    next();
  }
};

router.get("/", login, function(req, res) {


  res.render("signup", {
      messages: res.locals.getMessages()
  });
});

router.post('/', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/',
    failureFlash: true
}));

router.get("/signup", function(req, res) {
  res.render("signup");
});

router.post("/signup", function(req, res) {
  Robots.create({
    username: req.body.username,
    password: req.body.password,
    name: req.body.name,
    email: req.body.email

  }).then(function(data) {
    console.log(data);
    res.redirect("/");
  })
  .catch(function(err) {
    console.log(err);
    res.redirect("/signup");
  });
});

router.get("/profile", requireLogin, function(req, res) {
  
  res.render("profile", {username: req.user.username});
});

router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

router.get('/', function(req, res){

    Users.find({}).sort("name")
    .then(function(users){
     console.log(users);
     req.session.users = users;
     res.render("login", {users: req.session.users})
    })
    .catch(function(err){
      console.log(err);
    })
  }
);



router.post('/login', function(req, res){
console.log("we here");
  res.redirect("/profile")
});



router.post('/signup', function(req, res){
  Users.create({
    username: req.body.username,
    passwordHash: req.body.password,
    name: req.body.name,
    email: req.body.email,

  })
  .then(function(data){
    console.log(data);
  })

  res.redirect('/')


});



///////////////////////////////////////////////////////////

// router.get("/",  function (req,res) {
//   res.render("index", {users:data})
//
// });
// router.get('/employed',  function(req, res) {
//   let job = req.params.job;
//   let employed = [];
//   data.forEach(function(user) {
//     if (user.job != null) {
//       employed.push(user);
//
//     }
//   });
//   res.render('employed', {users: employed})
// });
//
//
// router.get('/looking',  function(req, res) {
//   let job = req.params.job;
//   let looking = [];
//   data.forEach(function(user) {
//   if (user.job == null) {
//     looking.push(user);
//
//   }
//   });
//   res.render('looking', {users:looking})
// });
//
//
//
// router.get('/profile/:id',  function(req, res) {
//   let id = req.params.id;
//
//   let listing = [];
//   data.forEach(function(user) {
//     if (user.id == id) {
//       listing.push(user);
//
//     }
//   });
//   console.log(listing);
//
//   res.render('profile', {users: listing});
// });


///////////////////////////////////////////////////







module.exports=router;



























module.exports=router;
