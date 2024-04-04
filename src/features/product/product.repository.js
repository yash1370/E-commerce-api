import { ObjectId } from "mongodb";
import { getDb } from "../../config/mongodb.js";

class ProductRepository {
  constructor() {
    this.collection = "products";
  }
  async add(newProduct) {
    try {
      // 1. Get the database
      const db = getDb();
      // 2. Get the collection
      const collection = db.collection(this.collection);
      // 3. Insert the document.
      await collection.insertOne(newProduct);
      return newProduct;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getAll() {
    try {
      // 1. Get the database
      const db = getDb();
      // 2. Get the collection
      const collection = db.collection(this.collection);
      // 3. Find the document.
      return await collection.find().toArray();
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
  async get(id) {
    try {
      // 1. Get the database
      const db = getDb();
      // 2. Get the collection
      const collection = db.collection(this.collection);
      // 3. Find the document.
      return await collection.find({ _id: ObjectId(id) });
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}

export default ProductRepository;
