import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";
import bcrypt from "bcrypt";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }
  async signUp(req, res, next) {
    const { name, email, password, type } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new UserModel(name, email, hashedPassword, type);
      await this.userRepository.signUp(user);
      res.status(201).send(user);
    } catch (err) {
      next(err);
    }
  }

  async login(req, res) {
    try {
      // find user by email
      const user = await this.userRepository.findByEmail(req.body.email);

      if (!user) {
        return res.status(400).send("Incorrect Credentials");
      } else {
        //  compare password with hashed password
        const result = await bcrypt.compare(req.body.password, user.password);
        if (result) {
          // 1. create a token
          const token = jwt.sign(
            { userID: user._id, email: user.email },
            process.env.JWT_KEY,
            { expiresIn: "1h" }
          );
          // 2. send the token
          return res.status(200).send(token);
        } else {
          return res.status(400).send("Incorrect Credentials");
        }
      }
    } catch (err) {
      // next(err);
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }

  async resetPassword(req, res, next) {
    const { newPassword } = req.body;
    const userId = req.userId;
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    try {
      await this.userRepository.resetPassword(userId, hashedPassword);
      res.status(200).send("Password is reset successfully");
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }
}
