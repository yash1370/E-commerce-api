import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";

// create model from schema

const userModel = mongoose.model("user", userSchema);

export default class UserRepository {
  async signUp(user) {
    //  create instance of model
    try {
      const newUser = new userModel(user);
      await newUser.save();
      return newUser;
    } catch (err) {
      console.log(err);
      if (err instanceof mongoose.Error.ValidationError) {
        throw err;
      } else {
        throw new ApplicationError("Something went wrong with database", 500);
      }
    }
  }

  async login(email, password) {
    try {
      return await userModel.findOne({ email, password });
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async findByEmail(email) {
    try {
      return await userModel.findOne({ email });
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async resetPassword(userId, newPassword) {
    try {
      let user = await userModel.findById(userId);
      if (user) {
        user.password = newPassword;
        user.save();
      } else {
        throw new Error("User not found");
      }
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}
