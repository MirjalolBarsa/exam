import { Schema, Types, model } from "mongoose";

const solidProductSchema = new Schema(
  {
    productId: { type: Types.ObjectId, required: true, ref: "Product" },
    clentId: { type: Types.ObjectId, required: true, ref: "Clent" },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const SolidProduct = model("SolidProduct", solidProductSchema);
export default SolidProduct;
