import User from "./classes/user.js";
import Genre from "./classes/genre.js";
import Post from "./classes/post.js";

//DBs

var userDB = [
  {
    id: 0,
    username: "hsck98",
    password: "Lifegood98",
    email: "hsck98@gmail.com"
  },
  {
    id: 1,
    username: "wendy",
    password: "wendy123",
    email: "wendy@gmail.com"
  }

];

var genreDB = [
  {
    id: 0,
    userId: 0,
    genreName: "Learning",
  },
  {
    id: 1,
    userId: 0,
    genreName: "Games",
  },
  {
    id: 2,
    userId: 1,
    genreName: "Trips"
  }
]

var postDB = [
  {
    id: 0,
    userId: 0,
    genreId: 0,
    img: "images/overcooked.png",
    title: "Overcooked",
    description: "Chaotic couch co-op cooking game for one to four players. You and your fellow chefs must prepare, cook and serve up orders before the buying customers storm out in a huff.",
    blog: "",
  },
  {
    id: 1,   
    userId: 0,
    genreId: 0,
    img: "images/cs2.png",
    title: "Counter Strike 2",
    description: "Multiplayer tactical first-person shooter game developed and published by Valve.",
    blog: "<p><strong>Counter-Strike 2</strong> is a 2023 multiplayer tactical first-person shooter game developed and published by Valve. It is the fifth main installment of the Counter-Strike series. Developed as an updated version of the previous main entry, Counter-Strike: Global Offensive (2012), it was announced on March 22, 2023 and was released on September 27, 2023, replacing Global Offensive on Steam. Like its predecessor, the game pits two teams, the Counter-Terrorists and the Terrorists, against each other in various objective-based game modes. Counter-Strike 2 features major technical improvements over Global Offensive, including a move from the Source game engine to Source 2, improved graphics and new server architecture. In addition, many maps from Global Offensive were updated to use the features of Source 2, with some maps receiving complete overhauls. Upon release, Counter-Strike 2 received generally favorable reviews from critics. In contrast, player reception was mixed; criticism was directed at the delisting of Global Offensive from Steam, degraded game performance, and the removal of several features that had been present in Global Offensive. As a result, Counter-Strike 2 received thousands of negative user reviews on Steam, leading to it becoming one of the lowest-rated Valve titles on the platform.</p>",
  },
  {
    id: 2,
    userId: 0,
    genreId: 0,
    img: "images/lol.png",
    title: "League of Legends",
    description: "Multiplayer online battle arena video game developed and published by Riot Games.",
    blog: "",
  },
  {
    id: 3,
    userId: 1,
    genreId: 0,
    img: "images/stardew.png",
    title: "Stardew Valley",
    description: 'Farm life simulation game developed by Eric "ConcernedApe" Barone.',
    blog: "",
  }
];

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