import { ObjectId } from "mongodb";
import { getDb } from "../../config/mongodb.js";
import mongoose from "mongoose";
import { productSchema } from "./product.schema.js";
import { reviewSchema } from "./review.schema.js";
import { categorySchema } from "./category.schema.js";

const ProductModel = mongoose.model("Product", productSchema);
const ReviewModel = mongoose.model("Review", reviewSchema);
const CategoryModel = mongoose.model("Category", categorySchema);

class ProductRepository {
  constructor() {
    this.collection = "products";
  }

  async add(productData) {
    try {
      // // 1 . Get the db.
      // const db = getDb();
      // const collection = db.collection(this.collection);
      // await collection.insertOne(newProduct);
      // return newProduct;
      //  1. add the product
      productData.categories = productData.category
        .split(",")
        .map((e) => e.trim());
      console.log("productData: ", productData);
      const newProduct = new ProductModel(productData);
      const savedProduct = await newProduct.save();

      //  2. update the categories
      await CategoryModel.updateMany(
        { _id: { $in: productData.categories } },
        { $push: { products: new ObjectId(savedProduct._id) } }
      );
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

  async filterProduct(minPrice, categories) {
    try {
      const db = getDb();
      const collection = db.collection(this.collection);
      let filterExpression = {};
      if (minPrice) {
        filterExpression.price = {
          $gte: parseFloat(minPrice),
        };
      }
      // if (maxPrice) {
      //   console.log("first", maxPrice);
      //   filterExpression.price = {
      //     ...filterExpression.price,
      //     $lte: parseFloat(maxPrice),
      //   };
      //   console.log("filterExpression.price: ", filterExpression.price);
      // }
      categories = JSON.parse(categories.replace(/'/g, '"'));
      console.log("categories: ", categories);
      if (categories) {
        filterExpression = {
          $or: [{ category: { $in: categories } }, filterExpression],
        };
      }
      const filter = await collection
        .find(filterExpression)
        .project({ name: 1, price: 1, _id: 0, ratings: { $slice: 1 } })
        .toArray();
      // console.log("filter: ", filter);
      return filter;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  // async rate(userId, productId, rating) {
  //   try {
  //     const db = getDb();
  //     const collection = db.collection(this.collection);
  //     //  1. Find the product
  //     const product = await collection.findOne({
  //       _id: new ObjectId(productId),
  //     });
  //     //  2. Find the rating
  //     const userRating = product?.ratings?.find((r) => r.userId == userId);
  //     if (userRating) {
  //       //  3. Update the rating
  //       await collection.updateOne(
  //         {
  //           _id: new ObjectId(productId),
  //           "ratings.userId": new ObjectId(userId),
  //         },
  //         {
  //           $set: {
  //             "ratings.$.rating": rating,
  //           },
  //         }
  //       );
  //     } else {
  //       await collection.updateOne(
  //         { _id: new ObjectId(productId) },
  //         {
  //           $push: { ratings: { userId: new ObjectId(userId), rating } },
  //         }
  //       );
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     throw new ApplicationError("Something went wrong with database", 500);
  //   }
  // }

  async rate(userId, productId, rating) {
    try {
      //  1. Check if product is exists
      const productToUpdate = await ProductModel.findById(productId);
      if (!productToUpdate) {
        throw new Error("Product not found");
      }
      //  2. Get Existing review
      const userReview = await ReviewModel.findOne({
        product: new ObjectId(productId),
        user: new ObjectId(userId),
      });
      if (userReview) {
        userReview.rating = rating;
        await userReview.save();
      } else {
        const newReview = await ReviewModel({
          product: new ObjectId(productId),
          user: new ObjectId(userId),
          rating: rating,
        });
        newReview.save();
      }
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async averageProductPricePerCategory() {
    try {
      const db = getDb();
      return await db
        .collection(this.collection)
        .aggregate([
          {
            // stage 1: Get average price per category
            $group: {
              _id: "$category",
              averagePrice: { $avg: "$price" },
            },
          },
        ])
        .toArray();
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}

export default ProductRepository;
