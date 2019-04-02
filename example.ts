import ChainedArray, { pick } from "./src";

interface IUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  birthdate: string;
  added: string;
}
const users: IUser[] = require("./users.json");

const arr = new ChainedArray(users);

console.log(
  arr.groupBy(({email}) => email.length.toString()),
);
