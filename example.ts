import ChainedArray, { pick } from "./src";

interface IUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  birthdate: string;
  added: string;
}
const users: IUser[] = require("./__tests__/users.json");

const arr = new ChainedArray(users);

const arr1 = arr.map(({ id }) => id);

console.log(arr, arr1);
