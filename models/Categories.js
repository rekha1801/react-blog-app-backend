import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
  {
    name: { type: String, required: false, unique: true },
  },
  { timestamps: true }
);

const Categories = mongoose.model("Categories", categorySchema);

export default Categories;
