import { Schema, model } from "mongoose";

const SalesmanSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      reuired: true,
      trim: true,
      match: /^\+998\d{9}$/,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Salesman = model("Salesman", SalesmanSchema);
export default Salesman;
