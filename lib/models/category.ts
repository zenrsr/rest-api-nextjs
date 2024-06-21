import { model, models, Schema } from "mongoose";

const CategorySchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);
// This line serves to either use an existing model named "category" or create a new one using the provided schema.
const category = models.category || model("category", CategorySchema);

export default category;
