import { getDb } from "../../config/mongodb.js";

class UserRepository {
  async signUp(newUser) {
    try {
      // 1. Get the database
      const db = getDb();
      // 2. Get the collection
      const collection = db.collection("users");

      // 3. Insert the document.
      await collection.insertOne(newUser);
      return newUser;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async login(email, password) {
    try {
      // 1. Get the database
      const db = getDb();
      // 2. Get the collection
      const collection = db.collection("users");

      // 3. Find the document.
      return await collection.findOne({ email, password });
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}

export default UserRepository;
