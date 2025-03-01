import { hash } from "bcrypt";

export const createUserData = async () => {
  return [
    {
      name: "test",
      email: "test@example.com",
      password: await hash("password", 10),
      role: "user",
    },
    {
      name: "admin",
      email: "admin@example.com",
      password: await hash("password", 10),
      role: "admin",
    },
  ];
};
