import { ObjectId } from "mongodb";
import { getDb } from "../../config/mongodb.js";

class ProductRepository {
  constructor() {
    this.collection = "products";
  }

  async add(newProduct) {
    try {
      // 1 . Get the db.
      const db = getDb();
      const collection = db.collection(this.collection);
      await collection.insertOne(newProduct);
      return newProduct;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getAll() {
    try {
      const db = getDb();
      const collection = db.collection(this.collection);
      const products = await collection.find().toArray();
      console.log(products);
      return products;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async get(id) {
    try {
      const db = getDb();
      const collection = db.collection(this.collection);
      return await collection.findOne({ _id: new ObjectId(id) });
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async filterProduct(minPrice, maxPrice, category) {
    try {
      const db = getDb();
      const collection = db.collection(this.collection);
      let filterExpression = {};
      if (minPrice) {
        filterExpression.price = {
          $gte: parseFloat(minPrice),
        };
      }
      if (maxPrice) {
        console.log("first", maxPrice);
        filterExpression.price = {
          ...filterExpression.price,
          $lte: parseFloat(maxPrice),
        };
        console.log("filterExpression.price: ", filterExpression.price);
      }
      if (category) {
        filterExpression.category = category;
      }
      const filter = await collection.find(filterExpression).toArray();
      console.log("filter: ", filter);
      return filter;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async rate(userId, productId, rating) {
    try {
      const db = getDb();
      const collection = db.collection(this.collection);
      collection.updateOne(
        { _id: new ObjectId(productId) },
        {
          $push: { rating: { userId: new ObjectId(userId), rating } },
        }
      );
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}

export default ProductRepository;
