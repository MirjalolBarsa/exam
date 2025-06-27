import { Schema, model } from "mongoose";

const salesmanSchema = new Schema(
  {
    username: { type: String, unique: true, required: true },
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

salesmanSchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "salesmanId",
});

const Salesman = model("Salesman", salesmanSchema);

export default Salesman;
