import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";

export default class UserController {
  signUp(req, res) {
    const { name, email, password, type } = req.body;
    const user = UserModel.signUp(name, email, password, type);
    res.status(201).send(user);
  }

  login(req, res) {
    const result = UserModel.login(req.body.email, req.body.password);
    if (!result) {
      return res.status(400).send("Incorrect Credentials");
    } else {
      // 1. create a token
      const token = jwt.sign(
        { userID: result.id, email: result.email },
        "ejhefghdegvh",
        { expiresIn: "1h" }
      );
      // 2. send the token
      return res.status(200).send(token);
    }
  }
}
