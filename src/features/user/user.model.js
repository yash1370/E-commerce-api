export default class UserModel {
  constructor(name, email, password, type, id) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.type = type;
    this.id = id;
  }

  static SignUp(email, password, name, type) {
    const newUser = new UserModel(name, email, password, type);
    console.log('newUser: ', newUser);
    newUser.id = users.length + 1;
    users.push(newUser);
    return newUser;
  }

  static Login(email, password) {
    const createdUser = users.find((u) => u.email === email && u.password === password);
    console.log('createdUser: ', createdUser);
    return createdUser;
  }
}

var users = [
  {
    id: "1",
    name: "Seller User",
    email: "seller@seller.com",
    password: "seller@123",
    type: "seller",
  },
];
