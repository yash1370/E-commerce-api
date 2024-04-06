import { ObjectId } from "mongodb";
import { getDb } from "../../config/mongodb.js";

export default class CartItemsRepository {
  constructor() {
    this.collection = "cartItems";
  }

  async add(productId, userId, quantity) {
    try {
      // 1 . Get the db.
      const db = getDb();
      const collection = db.collection(this.collection);
      // const id = await this.getNextCounter(db);
      // console.log("id: ", id);
      //  find the document
      // either insert or update
      // Insertion
      await collection.updateOne(
        {
          productID: new ObjectId(productId),
          userID: new ObjectId(userId),
        },
        // { $setOnInsert: { _id: id }, $inc: { quantity: quantity } },
        { $inc: { quantity: quantity } },
        { upsert: true }
      );
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async get(userId) {
    try {
      const db = getDb();
      const collection = db.collection(this.collection);
      return await collection.find({ userID: new ObjectId(userId) }).toArray();
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async delete(userId, cartItemId) {
    try {
      const db = getDb();
      const collection = db.collection(this.collection);
      const result = await collection.deleteOne({
        _id: new ObjectId(cartItemId),
        userID: new ObjectId(userId),
      });
      return result.deletedCount > 0;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  // async getNextCounter(db) {
  //   const resultDocument = await db
  //     .collection("counters")
  //     .findOneAndUpdate(
  //       { _id: "cartItemId" },
  //       { $inc: { value: 1 } },
  //       { returnDocument: "after" }
  //     );
  //   console.log("resultDocument: ", resultDocument);
  //   return resultDocument.value.value;
  // }
}
