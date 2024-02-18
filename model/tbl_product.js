import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    feelingName: {
      type: String,
    },
    imagePath: {
      type: String,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tbl_user",
    },
    status: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

const tbl_product = mongoose.model("tbl_product", userSchema);

export default tbl_product;
