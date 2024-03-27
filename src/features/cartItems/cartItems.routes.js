// Manage routes/paths to ProductController

// 1. Import express.
import express from "express";
import CartItemsController from "./cartItems.controller.js";

// 2. Initialize Express router.
const cartItemsRouter = express.Router();
const cartItemsController = new CartItemsController();

// All the paths to the controller methods.
// localhost/api/products
// localhost:4100/api/products/filter?minPrice=10&maxPrice=20&category=Category1

cartItemsRouter.post("/", cartItemsController.add);
cartItemsRouter.get("/", cartItemsController.get);
cartItemsRouter.delete("/:id", cartItemsController.delete);

export default cartItemsRouter;
