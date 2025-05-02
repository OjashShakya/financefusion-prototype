const mongoose = require("mongoose");
const Expense = require("../models/expense.model"); // Ensure path matches your project structure
const { StatusCodes } = require("http-status-codes");

// Create a new expense
const createExpense = async (req, res) => {
  try {
    const { amount, category, description, date } = req.body;

    const newExpense = new Expense({
      user: req.user.id, // assumes user is added to req by auth middleware
      amount,
      category,
      description,
      date,
    });

    const savedExpense = await newExpense.save();
    res.status(StatusCodes.CREATED).json(savedExpense);
  } catch (err) {
    console.error("Error creating expense:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error creating expense",
      error: err.message,
    });
  }
};

// Get all expenses for the logged-in user
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.status(StatusCodes.OK).json(expenses);
  } catch (err) {
    console.error("Error fetching expenses:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error fetching expenses",
      error: err.message,
    });
  }
};

// Get a specific expense by ID
const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid expense ID" });
    }

    const expense = await Expense.findById(id);

    if (!expense) return res.status(StatusCodes.NOT_FOUND).json({ message: "Expense not found" });

    if (expense.user.toString() !== req.user.id) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: "Not authorized to view this expense" });
    }

    res.status(StatusCodes.OK).json(expense);
  } catch (err) {
    console.error("Error fetching expense:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error fetching expense",
      error: err.message,
    });
  }
};

// Delete an expense
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid expense ID" });
    }

    const expense = await Expense.findById(id);

    if (!expense) return res.status(StatusCodes.NOT_FOUND).json({ message: "Expense not found" });

    // Convert both IDs to strings for comparison
    const expenseUserId = expense.user.toString();
    const currentUserId = req.user.id.toString();

    if (expenseUserId !== currentUserId) {
      console.log("User ID mismatch:", {
        expenseUserId,
        currentUserId,
        expenseUser: expense.user,
        currentUser: req.user.id
      });
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Not authorized to delete this expense",
        details: "User ID mismatch"
      });
    }

    await expense.deleteOne();
    res.status(StatusCodes.OK).json({ message: "Expense deleted successfully" });
  } catch (err) {
    console.error("Error deleting expense:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error deleting expense",
      error: err.message,
    });
  }
};

// Delete all expenses for the logged-in user
const deleteAllExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await Expense.deleteMany({ user: userId });
    
    res.status(StatusCodes.OK).json({ 
      message: "All expenses deleted successfully",
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('Error deleting all expenses:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      message: 'Error deleting all expenses', 
      error: error.message 
    });
  }
};

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  deleteExpense,
  deleteAllExpenses,
};
