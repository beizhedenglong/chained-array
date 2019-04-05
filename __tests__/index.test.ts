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

describe("ChainedArray", () => {
  const chainedUsers = new ChainedArray(users);
  test("count", () => {
    expect(chainedUsers.count(({ id }) => id)).toEqual(100);
  });
  test("size", () => {
    expect(chainedUsers.size()).toEqual(100);
  });

  test("filter", () => {
    expect(
      chainedUsers.filter(({ id }) => id > 50)
        .size(),
    ).toEqual(50);
  });

  test("innerJoin", () => {
    expect(
      chainedUsers
        .innerJoin(posts, (a, b) => a.id - b.author_id)
        .sort((a, b) => a.left.id - b.right.id)
        .head()
        .right.author_id,
    ).toEqual(1);
  });
});
