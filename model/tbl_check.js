import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    checkpro: {
      type: String,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tbl_user",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tbl_product",
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

const tbl_check = mongoose.model("tbl_check", userSchema);

export default tbl_check;
