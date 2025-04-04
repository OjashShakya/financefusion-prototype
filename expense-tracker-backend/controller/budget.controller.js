const mongoose = require("mongoose");
const Budget = require("../models/budget.model");
const { StatusCodes } = require("http-status-codes");

// Create a new budget
const createBudget = async (req, res) => {
  try {
    const { category, amount, period } = req.body;

    const newBudget = new Budget({
      user: req.user.id,
      category,
      amount,
      period,
    });

    const savedBudget = await newBudget.save();
    res.status(StatusCodes.CREATED).json(savedBudget);
  } catch (err) {
    console.error("Error creating budget:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error creating budget",
      error: err.message,
    });
  }
};

// Get all budgets for the logged-in user
const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(StatusCodes.OK).json(budgets);
  } catch (err) {
    console.error("Error fetching budgets:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error fetching budgets",
      error: err.message,
    });
  }
};

// Get a specific budget by ID
const getBudgetById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid budget ID" });
    }

    const budget = await Budget.findById(id);

    if (!budget) return res.status(StatusCodes.NOT_FOUND).json({ message: "Budget not found" });

    // Convert both to strings for comparison
    const budgetUserId = budget.user.toString();
    const requestUserId = req.user.id.toString();
    
    if (budgetUserId !== requestUserId) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: "Not authorized to view this budget" });
    }

    res.status(StatusCodes.OK).json(budget);
  } catch (err) {
    console.error("Error fetching budget:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error fetching budget",
      error: err.message,
    });
  }
};

// Delete a budget
const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid budget ID" });
    }

    const budget = await Budget.findById(id);

    if (!budget) return res.status(StatusCodes.NOT_FOUND).json({ message: "Budget not found" });

    // Convert both to strings for comparison
    const budgetUserId = budget.user.toString();
    const requestUserId = req.user.id.toString();
    
    if (budgetUserId !== requestUserId) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: "Not authorized to delete this budget" });
    }

    await budget.deleteOne();
    res.status(StatusCodes.OK).json({ message: "Budget deleted successfully" });
  } catch (err) {
    console.error("Error deleting budget:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error deleting budget",
      error: err.message,
    });
  }
};

module.exports = {
  createBudget,
  getBudgets,
  getBudgetById,
  deleteBudget,
};
