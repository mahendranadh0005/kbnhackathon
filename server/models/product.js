import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },   // your manual ID
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },  // store image link
  category: { type: String },
  location: { type: String },
  direction: { type: String },
  description: { type: String }
});

const Product = mongoose.model("Product", productSchema);

export default Product;
