export default class Post {
  constructor(id, userId, genreId, img, title, description, blog) {
    this.id = id;
    this.userId = userId;
    this.genreId = genreId;
    this.img = img;
    this.title = title;
    this.description = description;
    this.blog = blog;
  };
}