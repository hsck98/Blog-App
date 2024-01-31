import User from "./classes/user.js";
import Genre from "./classes/genre.js";
import Post from "./classes/post.js";

//DBs

var userDB = [];

var genreDB = [];

var postDB = [];

export function usernameExists(username) {
  var exists = false;
  userDB.forEach((user) => {
    if (username === user.username) {
      exists = true;
      return;
    }
  })
  return exists;
}

export function emailExists(email) {
  var exists = false;
  userDB.forEach((user) => {
    if (email === user.email) {
      exists = true;
      return;
    }
  })
  return exists;
}

export function userExists(username, password) {
  var userId = null;
  userDB.forEach((user) => {
    if(username === user.username && password === user.password) {
      userId = user.id;
      return;
    }
  });
  return userId;
}

export function getUser(id) {
  var user = null;
  userDB.forEach((item) => {
    if(item.id == id) {
      user = item;
      return user;
    }
  });
  return user;
}

export function getAllUsers() {
  var userList = structuredClone(userDB);
  userList.forEach((user) => {
    delete user.password;
    delete user.email;
  })

  return userList;
}

export function addUser(username, password, email) {
  var id = getNewId("user");
  userDB.push(new User(id, username, password, email));
  return getUser(id);
}

export function getNewUserId() {
  var id = postDB.at(-1).id + 1;
  console.log("New user id: " + id);
  return id;
}

export function getGenre(id) {
  var genre = null;
  genreDB.forEach((item) => {
    if(item.id == id) {
      genre = item;
      return genre;
    }
  });
  return genre;
}

export function getAllGenres() {
  return genreDB;
}

export function getGenres(userId) {
  var genres = [];
  genreDB.forEach((genre) => {
    if(genre.userId === userId) {
      genres.push(genre);
    }
  });
  return genres;
}

export function addGenre(userId, genreName) {
  var id = getNewId("genre");
  genreDB.push(new Genre(id, userId, genreName));
  return getGenre(id);
}

export function getPost(id) {
  var post = null;
  postDB.forEach((item) => {
    if(item.id == id) {
      post = item;
      return post;
    }
  });
  return post;
}

export function getAllPosts() {
  return postDB;
}

export function getPosts(userId) {
  var posts = {};
  postDB.forEach((post) => {
    if(post.userId == userId) {
      if (post.genreId in posts) {
        posts[post.genreId].push(post);
      } else {
        posts[post.genreId] = [post];
      }
    }
  });
  
  return posts;
}

export function addPost(userId, genreId, img, title, description, blog) {
  var id = getNewId("post");
  postDB.push(new Post(id, userId, genreId, img, title, description, blog));
  return getPost(id);
}

export function deletePost(id) {
  for (var i=0; i<postDB.length; i++) {
    if(postDB[i].id == id) {
      postDB.splice(i, 1);
      return;
    } 
  }
  return;
}

export function editPost(id, genreId, img, title, description, blog) {
  var index = postDB.findIndex((post => post.id == id));
  postDB[index].genreId = genreId;
  if (img != "")
    postDB[index].img = img;
  
  postDB[index].title = title;
  postDB[index].description = description;
  postDB[index].blog = blog;
  return postDB[index];
}

export function getNewId(type) {
  var id = 0;
  
  if (type == "user") {
    if (userDB.length != 0) 
      id = userDB.at(-1).id + 1;
  } else if (type == "genre") {
    if (genreDB.length != 0) 
      id = genreDB.at(-1).id + 1;
  } else if (type == "post") {
    if (postDB.length != 0) 
      id = postDB.at(-1).id + 1;
  }
  
  return id;
}