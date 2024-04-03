import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }
  async signUp(req, res) {
    const { name, email, password, type } = req.body;
    const user = new UserModel(name, email, password, type);
    await this.userRepository.signUp(user);
    res.status(201).send(user);
  }

  async login(req, res) {
    try {
      const result = await this.userRepository.login(
        req.body.email,
        req.body.password
      );
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
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }
}
