import { Schema, model } from "mongoose";

const clentSchema = new Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
clentSchema.virtual("solid", {
  ref: "SolidProduct",
  localField: "_id",
  foreignField: "clentId",
});

const Clent = model("Clent", clentSchema);
export default Clent;
