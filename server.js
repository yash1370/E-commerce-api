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

// 2. Create Server
const server = express();

server.use(express.json());
server.use(cookieParser());
// for all requests related to product, redirect to product routes.
// localhost:3200/api/products
server.use("/api-docs", swagger.serve, swagger.setup(apiDocs));
server.use("/api/products", jwtAuth, productRouter);
server.use("/api/users", userRouter);
server.use("/api/cartItems", jwtAuth, cartItemsRouter);

// 3. Default request handler
server.get("/", (req, res) => {
  res.send("Welcome to Ecommerce APIs");
});

// 4. Specify port.
server.listen(3200, () => {
  console.log("Server is running at 3200");
  MongodbConnection();
});
