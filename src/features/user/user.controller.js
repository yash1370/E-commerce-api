import UserModel from "./user.model.js";

export default class UserController {
  SignUp(req, res) {
    const { name, email, password, type } = req.body;
    const user = UserModel.SignUp(name, email, password, type);
    console.log('user: ', user);
    res.status(201).send(user);
  }

  Login(req, res) {
    const result = UserModel.Login(req.body.email, req.body.password);
    console.log("result: ", result);
    if (!result) {
      return res.status(400).send("Incorrect Credentials");
    } else {
      return res.send("Login Successful");
    }
  }
}
