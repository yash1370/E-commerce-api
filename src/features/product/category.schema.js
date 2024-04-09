import mongoose from "mongoose";

export const categorySchema = new mongoose.Schema({
  name: String,
  products: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
    },
  ],
});
