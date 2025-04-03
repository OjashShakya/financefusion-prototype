const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Salary",
        "Business",
        "Investments",
        "Freelancing",
        "Rental",
        "Dividends",
        "Interest",
        "Gifts",
        "Other"
      ],
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Income || mongoose.model("Income", incomeSchema);
