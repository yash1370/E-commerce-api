// Manage routes/paths to ProductController

// 1. Import express.
import express from "express";
import UserController from "./user.controller.js";

// 2. Initialize Express router.
const userRouter = express.Router();
const userController = new UserController();

// All the paths to the controller methods.
// localhost:4100/api/products/filter?minPrice=10&maxPrice=20&category=Category1

userRouter.post("/sign-up", (req, res) => {
  userController.signUp(req, res);
});
userRouter.post("/login", (res, req) => {
  userController.login(req, res);
});

export default userRouter;
