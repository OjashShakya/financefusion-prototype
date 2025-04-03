const mongoose = require("mongoose");

const savingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      default: "",
    },
    target_amount: {
      type: Number,
      required: true,
    },
    initial_amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    color: {
      type: String,
      default: "#0088FE",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Savings || mongoose.model("Savings", savingSchema);
