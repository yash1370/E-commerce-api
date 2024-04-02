import { getDb } from "../../config/mongodb.js";
import UserModel from "./user.model.js";

class UserRepository {
  async signUp(newUser) {
    try {
      // 1. get database
      const db = getDb();

      //  2. get the collection
      const collection = db.collection("users");

      // 3. Insert the document
      await collection.insertOne(newUser);
      return newUser;
    } catch (err) {
      throw new ApplicationError("Somethings went wrong", 503);
    }
  }

  async login(email, password) {
    try {
      // 1. get database
      const db = getDb();

      //  2. get the collection
      const collection = db.collection("users");

      // 3. find the document
      return await collection.findOne({ email, password });
    } catch (err) {
      throw new ApplicationError("Somethings went wrong", 503);
    }
  }
}

export default UserRepository;
