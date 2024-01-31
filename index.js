import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
// import tinymce from "tinymce";
import * as db from "./db.js";
import path from "path";
import {fileURLToPath} from "url";

//config
const app = express();
const port = 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

//Multer module
const storage = multer.diskStorage({
  destination: "public/images",
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
})
const upload = multer({ storage: storage});

//Body-Parser module
app.use(bodyParser.urlencoded({extended: true}));

//define dest path for express static files
app.use(express.static(path.join(__dirname, "public")));
// app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
app.set('views', path.join(__dirname, "views"));

//variables
var loggedUser = null;
var currentUser = null;
var genres;
var activeGenre = 0;
var posts;

//reload functions ----------------------------------------------------------------------------------------------------------------------
function reload(userId, genreId) {
  reloadUser(userId);
  reloadGenre(genreId);
  reloadGenres(userId);
  reloadPosts(userId);
}

function reloadUser(userId) {
  currentUser = db.getUser(userId);
}

function reloadGenre(genreId) {
  activeGenre = genreId;
}

function reloadGenres(userId) {
  genres = db.getGenres(userId);
}

function reloadPosts(userId) {
  posts = db.getPosts(userId);
}

//POST requests -----------------------------------------------------------------------------------------------------------------
app.post("/add-post", upload.single("image_upload"), (req, res) => {
  if(loggedUser.id != req.body["user-id"])
    res.render("error.ejs", {error: "You have no permission to add posts"});
  
  var userId = req.body["user-id"];
  var genreId;
  var title = req.body["post-title"];
  var description = req.body["post-description"];
  var img = "images/picture.png";
  var blog = req.body["post-blog"];

  if (req.file)
    img = "images/" + req.file.filename;

  if (req.body["genre"] == "newGenre" && req.body["genre-name"]) {
    var genre = db.addGenre(parseInt(userId), req.body["genre-name"]);
    genreId = genre.id;
  } else {
    genreId = parseInt(req.body["genre"]);
  }

  db.addPost(userId, genreId, img, title, description, blog);
  activeGenre = genreId;
  res.redirect("/");
});

app.post("/edit-post", upload.single("image_upload"), (req, res) => {
  if(loggedUser.id != req.body["user-id"]) {
    res.render("error.ejs", {error: "You have no permission to edit this post"});
  } else {
    var id = req.body["post-id"];
    var genreId;
    var img = "";
    var title = req.body["post-title"];
    var description = req.body["post-description"];
    var blog = req.body["post-blog"];

    if (req.file)
      img = "images/" + req.file.filename;

    if (req.body["genre"] == "newGenre" && req.body["genre-name"]) {
      var genre = db.addGenre(parseInt(userId), req.body["genre-name"]);
      genreId = genre.id;
    } else {
      genreId = parseInt(req.body["genre"]);
    }
    
    db.editPost(id, genreId, img, title, description, blog);
    activeGenre = genreId;
    res.redirect("/");
  }
})

app.post("/delete-post", upload.none(), (req, res) => { 
  var postId = req.body["deletePost"];
  db.deletePost(postId);

  activeGenre = req.body["genreId"];
});

app.post("/login", upload.none(), (req, res) => {
  var userId = db.userExists(req.body["username"], req.body["password"]);
  if (userId != null) {
    loggedUser = db.getUser(userId);
    res.redirect("/?user=" + userId);
  } else {
    res.render("login.ejs", {
      error: "You have entered the wrong username or password. Try again.",
      username: req.body["username"],
    });
  }
})

app.post("/register", upload.none(), (req, res) => {

  var errors = {};
  
  const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

  if (db.usernameExists(req.body["username"]))
    errors.username = "This username is already taken!";

  if (db.emailExists(req.body["email"]))
    errors.email = "This email is already registered!";

  if (!String(req.body["password"]).match(re)) {
    errors.password = ["Between 8 to 15 characters", "At least 1 letter, number and special character", "At least 1 upper and lowercase letter."];
  }
  if (req.body["password"] !== req.body["confirmPw"])
    errors.confirmPw = "Your passwords do not match!";

  if (Object.keys(errors).length > 0) {
    res.render("register.ejs", {username: req.body["username"], email: req.body["email"], "errors": errors});
  } else {
    var newUser = db.addUser(req.body["username"], req.body["password"], req.body["email"]);
    loggedUser = newUser;
    res.redirect("/?user="+ loggedUser.id);
  }
})


//GET requests --------------------------------------------------------------------------------------------------------------
app.get("/add-post", (req, res) => {
  if(loggedUser == null) {
    res.render("login.ejs");
  } else {
    res.render("addPost.ejs", {loggedUser: loggedUser,
                              genres: genres,
                              });
  }
})

app.get("/edit-post", (req, res) => {
  var post = db.getPost(req.query.id);
  if(loggedUser == null) {
    res.render("login.ejs");
  } else if (loggedUser.id != post.userId) {
    res.redirect("/view-post?id=" + req.query.id);
  } else {
    res.render("addPost.ejs", {loggedUser: loggedUser,
                                post: post,
                                genres: genres
                                });
  }
})

app.get("/view-post", (req, res) => {
  if(loggedUser == null) {
    res.render("login.ejs");
  } else {
    var post = db.getPost(req.query.id);
    var genre = db.getGenre(post.genreId);
    var canEdit = loggedUser.id == currentUser.id;
    res.render("viewPost.ejs", {loggedUser: loggedUser,
                                currentUser: currentUser,
                                post: post,
                                genre: genre,
                                canEdit: canEdit,
                                });
  }
})

app.get("/users", (req, res) => {
  res.render("users.ejs", {loggedUser: loggedUser, 
                          users: db.getAllUsers()});
}) 

app.get("/logout", (req, res) => {
  loggedUser = null;
  res.redirect("/");
}) 

app.get("/register", (req, res) => {
  res.render("register.ejs");
})

app.get("/", (req, res) => {
  if(req.query.user)
    reloadUser(req.query.user);

  if(loggedUser == null) {
    res.render("login.ejs");
  } else {
    reloadGenres(currentUser ? currentUser.id: loggedUser.id);
    reloadPosts(currentUser ? currentUser.id : loggedUser.id);
    // var html = writePostsHtml(posts, activeGenre);
    var canEdit = loggedUser.id == currentUser.id;
    res.render("home.ejs", {loggedUser: loggedUser, 
                            currentUser: currentUser,
                            activeGenre: activeGenre, 
                            genres: genres, 
                            posts: posts,
                            canEdit: canEdit,
                            // postHtml: html
                            });
  }  
})

// function writePostsHtml(posts, activeGenre) {
//   var html = '';

//   Object.entries(posts).forEach(([genre, genrePosts]) => {
//     var isActive = genre == activeGenre;
//     html += carouselSlideHtml(genre, genrePosts, isActive);
//   });

//   return html;
// }

// function carouselSlideHtml(genreId, genrePosts, isActive) {

//   var html = '<div id="carouselGenre' + genreId + '" class="carousel slide';
  
//   if(!isActive) {
//     html += ' d-none';
//   }

//   html += '" data-ride="carousel">';
//   html += '<div class="carousel-inner">';
//   for(var i = 0; i < genrePosts.length; i++) {
//     if(i % 3 == 0) {
//       html += '<div class="carousel-item';
//         if (i == 0)
//           html += ' active';
//       html += '"><div class="slide-container d-flex justify-content-evenly">';
//     }

//     html += cardHtml(genrePosts[i]);

//     if((i+1) % 3 == 0 || i == (genrePosts.length-1)) {
//       html += '</div></div>';
//     }
//   };

//   html += '</div></div>';

//   return html;
// }

// function cardHtml(post) {
//   var html = '<a class="anchorPost" href="/edit-post?id=' + post.id + '"><div id="post' + post.id + '" class="post mb-3"><div class="card">';
      
//   if (loggedUser.id == currentUser.id) {
//       html += '<button type="submit" class="deletePost close" onClick="deletePost(' + post.id + ')"><img src="images/close.png" alt="close"></button>';
//   }    
//       html += '<img class="img-fluid" alt="' + post.title + '" src="' + post.img + '">';
//       html += '<div class="card-body">';
//       html += '<h4 class="card-title">' + post.title + '</h4>';
//       html += '<p class="card-text">' + post.description + '</p>';
//       html += '</div></div></div></a>';

//   return html;
// }

app.listen(port, ()=> {
  console.log(`Server listening on port ${port}.`);
})