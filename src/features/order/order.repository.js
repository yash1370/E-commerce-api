import { ObjectId } from "mongodb";
import { getClient, getDb } from "../../config/mongodb.js";
import OrderModel from "./order.model.js";

export default class OrderRepository {
  constructor() {
    this.collection = "orders";
  }
  async placeOrder(userId) {
    try {
      const client = getClient();
      const session = client.startSession();
      const db = getDb();
      session.startTransaction();
      // 1. Get cartItems and calculate total amount.
      const items = await this.getTotalAmount(userId);
      const finalAmount = items.reduce(
        (acc, item) => acc + item.totalAmount,
        0
      );
      console.log("finalAmount", finalAmount);

      // 2. Create an order record.
      const newOrder = new OrderModel(
        new ObjectId(userId),
        finalAmount,
        new Date()
      );
      await db.collection(this.collection).insertOne(newOrder, { session });

      // 3. Reduce the stock.
      for (let item of items) {
        await db
          .collection("products")
          .updateOne(
            { _id: item.productId },
            { $inc: { stock: -item.quantity } },
            { session }
          );
      }
      throw new Error("something is wrong in place order");
      // 4. Clear the cart items.
      await db
        .collection("cartItems")
        .deleteMany({ userId: new ObjectId(userId) }, { session });
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }
  async getTotalAmount(userId, session) {
    const db = getDb();
    const items = await db
      .collection("cartItems")
      .aggregate(
        [
          //  1. get cart items for the user
          {
            $match: { userID: new ObjectId(userId) },
          },
          //  2. get the products form products collection.
          {
            $lookup: {
              from: "products",
              localField: "productID",
              foreignField: "_id",
              as: "productInfo",
            },
          },
          // 3. Unwind the product info.
          {
            $unwind: "$productInfo",
          },
          //  4. Calculate total amount for each cartItems.
          {
            $addFields: {
              totalAmount: {
                $multiply: ["$productInfo.price", "$quantity"],
              },
            },
          },
        ],
        { session }
      )
      .toArray();
    return items;
  }
}
