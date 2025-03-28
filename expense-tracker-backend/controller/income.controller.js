const mongoose = require("mongoose");
const Income = require("../models/income.model"); // Ensure path matches your project structure
const { StatusCodes } = require("http-status-codes");

// Create a new income
const createIncome = async (req, res) => {
  try {
    const { amount, source, description, date } = req.body;

    const newIncome = new Income({
      user: req.user.id, // assumes user is added to req by auth middleware
      amount,
      source,
      description,
      date,
    });

    const savedIncome = await newIncome.save();
    res.status(StatusCodes.CREATED).json(savedIncome);
  } catch (err) {
    console.error("Error creating income:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error creating income",
      error: err.message,
    });
  }
};

// Get all incomes for the logged-in user
const getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user.id }).sort({ date: -1 });
    res.status(StatusCodes.OK).json(incomes);
  } catch (err) {
    console.error("Error fetching incomes:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error fetching incomes",
      error: err.message,
    });
  }
};

// Get a specific income by ID
const getIncomeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid income ID" });
    }

    const income = await Income.findById(id);

    if (!income) return res.status(StatusCodes.NOT_FOUND).json({ message: "Income not found" });

    if (income.user.toString() !== req.user.id) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: "Not authorized to view this income" });
    }

    res.status(StatusCodes.OK).json(income);
  } catch (err) {
    console.error("Error fetching income:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error fetching income",
      error: err.message,
    });
  }
};

// Delete an income
const deleteIncome = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid income ID" });
    }

    const income = await Income.findById(id);

    if (!income) return res.status(StatusCodes.NOT_FOUND).json({ message: "Income not found" });

    if (income.user.toString() !== req.user.id) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: "Not authorized to delete this income" });
    }

    await income.deleteOne();
    res.status(StatusCodes.OK).json({ message: "Income deleted successfully" });
  } catch (err) {
    console.error("Error deleting income:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error deleting income",
      error: err.message,
    });
  }
};

module.exports = {
  createIncome,
  getIncomes,
  getIncomeById,
  deleteIncome,
};
