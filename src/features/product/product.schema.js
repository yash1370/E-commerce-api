import mongoose from "mongoose";

export const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  decs: String,
  inStock: Number,
  reviews: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Review",
    },
  ],
  categories: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
    },
  ],
});
