import ChainedArray from "../src/index";

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
const users: IUser[] = require("./users.json");
const posts: IPost[] = require("./posts.json");

test("ChainedArray", () => {
  const chainedUsers = new ChainedArray(users);
  expect(chainedUsers.count()).toEqual(100);
  expect(
    chainedUsers
    .innerJoin(posts, (a, b) => a.id - b.author_id)
    .sort((a, b) => a.left.id - b.right.id)
    .head()
    .right.author_id,
  ).toEqual(1);

});
