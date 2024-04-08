import "./env.js";
// 1. Import express
import express from "express";
import swagger from "swagger-ui-express";

// import bodyParser from 'body-parser';
import productRouter from "./src/features/product/product.routes.js";
import userRouter from "./src/features/user/user.routes.js";
import jwtAuth from "./src/middlewares/jwt.middleware.js";
import cookieParser from "cookie-parser";
import cartItemsRouter from "./src/features/cartItems/cartItems.routes.js";
import apiDocs from "./swagger.json" assert { type: "json" };
import { MongodbConnection } from "./src/config/mongodb.js";
import orderRouter from "./src/features/order/order.routes.js";
import { connectUsingMongoose } from "./src/config/mongooseConfig.js";
import mongoose from "mongoose";

// 2. Create Server
const server = express();

server.use(express.json());
server.use(cookieParser());
// for all requests related to product, redirect to product routes.
// localhost:3200/api/products
server.use("/api-docs", swagger.serve, swagger.setup(apiDocs));
server.use("/api/orders", jwtAuth, orderRouter);
server.use("/api/products", jwtAuth, productRouter);
server.use("/api/users", userRouter);
server.use("/api/cartItems", jwtAuth, cartItemsRouter);

// 3. Default request handler
server.get("/", (req, res) => {
  res.send("Welcome to Ecommerce APIs");
});

// Error handler middleware
server.use((err, req, res, next) => {
  console.log(err);
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).send(err.message);
  }
  if (err instanceof ApplicationError) {
    return res.status(err.code).send(err.message);
  }
  // server errors.
  res.status(500).send("Something went wrong, please try later");
});

// 4. Middleware to handle 404 requests.
server.use((req, res) => {
  res
    .status(404)
    .send(
      "API not found. Please check our documentation for more information at localhost:3200/api-docs"
    );
});

// 5. Specify port.
server.listen(3200, () => {
  console.log("Server is running at 3200");
  MongodbConnection();
  connectUsingMongoose();
});
