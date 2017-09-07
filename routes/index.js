const express = require("express");
const router = express.Router();
const app = express();
const Snippet = require("../models/snippet.js");
const User = require("../models/user");
const mongoose = require("mongoose");
const passport = require('passport');
mongoose.connect("mongodb://localhost:27017/snippet");

// let tagArray = [];



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
    res.redirect("/index")
  } else {
    next();
  }
};

router.get("/login", login, function(req, res) {


  res.render("signup", {
    messages: res.locals.getMessages()
  });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/index',
  failureRedirect: '/',
  failureFlash: true
}));

router.get("/signup", function(req, res) {
  res.render("signup");
});

router.post("/signup", function(req, res) {
  User.create({
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

router.get('/', function(req, res){

  User.find({}).sort("name")
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
const getSnippets = function(req, res, next) {
  Snippet.find({}).sort("title")
  .then(function(snippets) {
    req.snippets = snippets;
    next();
  })
  .catch(function(err) {
    console.log(err);
    next(err);
  });
};

router.get("/index", requireLogin, getSnippets, function(req,res) {
  for (var i = 0; i < req.snippets.length; i++) {
    if (req.snippets[i].username === req.user.username) {
      req.snippets[i].user = true;
    }
  }

  res.render("index", {snippets: req.snippets});

});
router.get("/tags/:tag", function(req, res) {
  Snippet.find({})
  .then(function(snippets) {
    let data = [];
    snippets.forEach(function(snippet) {
      snippet.tags.forEach(function(tag) {
        if (tag === req.params.tag) {
          data.push(snippet);
          return;
        }
      })
    })
    res.render("tags", {snippets: data, username: req.user.username});
  })
});
router.get("/language/:language", function (req, res) {
  Snippet.find({language: req.params.language})
  .then(function(snippets) {
    res.render("language", {snippets: snippets, username: req.user.username});
  })
});

router.get("/newsnip", requireLogin, function(req, res) {
  Snippet.find({username: req.user.username})
  .then(function(snippet){
    res.render("newsnip", {username: req.user.username, snippets: snippet});
  })
  });

router.post("/newsnip", requireLogin, function(req, res) {
  let tags = req.body.tags.split(",");
  Snippet.create({
    title: req.body.title,
    code: req.body.code,
    notes: req.body.notes,
    language: req.body.language,
    username: req.user.username,
    tags: tags
  })
  .then(function(data) {
    res.redirect("/index");
  })
});


router.get("/single/:id", function(req, res){
  Snippet.findById(req.params.id)
  .then(function(snippet){
    res.render("single", {snippets: snippet})
  })
})


router.post("/edit/", function(req, res){
  let tags = req.body.tags.split(" ");
  Snippet.updateOne({
    _id: req.body.button
  },
  {title: req.body.title,
    code: req.body.code,
    notes: req.body.notes,
    language: req.body.language,
    username: req.user.username,
    tags:      tags
  },
).then(function(snippets){
  res.redirect("/index");
})
});

router.get("/:snippet/edit", function(req, res){
  Snippet.findOne({_id: req.params.snippet}).then(function(snippet){
    console.log(snippet);
    res.render("edit", {snippet:snippet})
  })
});

router.post("/:snippetId/delete", function(req, res) {
  Snippet.deleteOne({_id: req.params.snippetId}).then(function(snippet){
    res.redirect("/index");
  })
});


router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});


module.exports=router;
