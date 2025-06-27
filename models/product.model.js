import { Schema, Types, model } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    color: { type: String, required: true },
    categoryId: { type: Types.ObjectId, ref: "Category", required: true },
    salesmanId: { type: Types.ObjectId, ref: "Salesman", required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
productSchema.virtual("sales", {
  ref: "SolidProduct",
  localField: "_id",
  foreignField: "productId",
});

const Product = model("Product", productSchema);

export default Product;
