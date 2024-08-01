import { UserGender, UserModel } from "@models/user.model";

export const addUser = () => {
  setTimeout(async () => {
    const userContent = {
      email: "sujonhasan171@gmail.com",
      username: "sujon",
      password: "123456",
      personal: {
        firstName: "sujon",
        lastName: "hasan",
        phone: "01719700000",
        gender: UserGender.male
      },
      superAdmin: true,
    };

    const user = new UserModel(userContent);

    const newUser = await user.save();
    console.log(newUser);
  }, 1100);
};
