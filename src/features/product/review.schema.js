import mongoose from "mongoose";

export const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  rating: Number,
});
