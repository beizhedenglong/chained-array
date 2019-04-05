import ChainedArray from "./src/index";

interface IUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  birthdate: string;
  added: string;
}
interface IPost {
  id: number;
  author_id: number;
  title: string;
  description: string;
  content: string;
  date: string;
}
const users: IUser[] = require("./tests/users.json");
const posts: IPost[] = require("./tests/posts.json");

const chainedUsers = new ChainedArray(users);

const result = chainedUsers
  .filter(({ email }) => email.length > 10)
  .distinct(({ last_name }) => last_name)
  .sort((a, b) => b.id - a.id)
  .innerJoin(posts, (user, post) => user.id - post.author_id)
  .map(({ left, right }) => left.id + "-" + right.author_id)
  .toArray()
  .join(",");

console.log(result);
