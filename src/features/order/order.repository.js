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
      const items = await this.getTotalAmount(userId, session);
      const finalTotalAmount = items.reduce(
        (acc, item) => acc + item.totalAmount,
        0
      );
      console.log(finalTotalAmount);

      // 2. Create an order record.
      const newOrder = new OrderModel(
        new ObjectId(userId),
        finalTotalAmount,
        new Date()
      );
      await db.collection(this.collection).insertOne(newOrder, { session });

      // 3. Reduce the stock.
      for (let item of items) {
        await db
          .collection("products")
          .updateOne(
            { _id: item.productID },
            { $inc: { stock: -item.quantity } },
            { session }
          );
      }

      throw new Error("Something is wrong in placeOrder");
      // 4. Clear the cart items.
      await db.collection("cartItems").deleteMany(
        {
          userId: new ObjectId(userId),
        },
        { session }
      );
      return;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getTotalAmount(userId, session) {
    const db = getDb();
    const items = await db
      .collection("cartItems")
      .aggregate(
        [
          // 1. Get cart items for the user
          {
            $match: { userID: new ObjectId(userId) },
          },
          // 2. Get the products form products collection.
          {
            $lookup: {
              from: "products",
              localField: "productID",
              foreignField: "_id",
              as: "productInfo",
            },
          },
          // 3. Unwind the productinfo.
          {
            $unwind: "$productInfo",
          },
          // 4. Calculate totalAmount for each cartitems.
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
