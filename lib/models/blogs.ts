import { model, models, Schema } from "mongoose";

const blogSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true }
  },
  { timestamps: true }
);

const blog = models.blog || model("blog", blogSchema);

export default blog;
