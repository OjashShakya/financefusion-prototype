const mongoose = require("mongoose");
const Income = require("../models/income.model"); // Ensure path matches your project structure
const { StatusCodes } = require("http-status-codes");

// Create a new income
const createIncome = async (req, res) => {
  try {
    const { amount, category, description, date } = req.body;
    const userId = req.user.id;

    // Convert date string to Date object if provided
    const incomeDate = date ? new Date(date) : new Date();

    const newIncome = new Income({
      user: userId,
      amount: Number(amount),
      category,
      description,
      date: incomeDate
    });

    await newIncome.save();
    res.status(StatusCodes.CREATED).json(newIncome);
  } catch (error) {
    console.error('Error creating income:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error creating income', error: error.message });
  }
};

// Get all incomes for the logged-in user
const getIncomes = async (req, res) => {
  try {
    const userId = req.user.id;
    const incomes = await Income.find({ user: userId }).sort({ date: -1 });
    res.status(StatusCodes.OK).json(incomes);
  } catch (error) {
    console.error('Error fetching incomes:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching incomes', error: error.message });
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
  } catch (error) {
    console.error('Error fetching income:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching income', error: error.message });
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

    if (!income) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Income not found" });
    }

    // Convert both IDs to strings for comparison
    const incomeUserId = income.user.toString();
    const currentUserId = req.user.id.toString();

    if (incomeUserId !== currentUserId) {
      console.log("User ID mismatch:", {
        incomeUserId,
        currentUserId,
        incomeUser: income.user,
        currentUser: req.user.id
      });
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Not authorized to delete this income",
        details: "User ID mismatch"
      });
    }

    await income.deleteOne();
    res.status(StatusCodes.OK).json({ message: "Income deleted successfully" });
  } catch (error) {
    console.error('Error deleting income:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error deleting income', error: error.message });
  }
};

module.exports = {
  createIncome,
  getIncomes,
  getIncomeById,
  deleteIncome,
};
