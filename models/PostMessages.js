import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  email: { type: String, required: [true, "Please login to see all tasks"] },
  title: { type: String, required: [true, "Please provide a title"] },
  description: {
    type: String,
    required: [true, "Please provide a description"],
  },
  category: { type: String, required: true },
  image: { type: String, required: true },
  date: {
    type: Date,
    default: new Date(),
  },
});
postSchema.index({ title: "text", description: "text", category: "text" });
const PostMessages = mongoose.model("PostMessages", postSchema);

export default PostMessages;
