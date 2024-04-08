// Manage routes/paths to ProductController

// 1. Import express.
import express from "express";
import UserController from "./user.controller.js";
import jwtAuth from "../../middlewares/jwt.middleware.js";

// 2. Initialize Express router.
const userRouter = express.Router();
const userController = new UserController();

// All the paths to the controller methods.
// localhost:4100/api/products/filter?minPrice=10&maxPrice=20&category=Category1

userRouter.post("/sign-up", (req, res, next) => {
  userController.signUp(req, res, next);
});
userRouter.post("/login", (req, res) => {
  userController.login(req, res);
});
userRouter.put("/reset-password", jwtAuth, (req, res) => {
  userController.resetPassword(req, res);
});

export default userRouter;
