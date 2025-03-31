const express = require("express");
const {
    createBudget,
    getBudgets,
    getBudgetById,
    deleteBudget
} = require("../controller/budget.controller");
const authenticateUser  = require("../middlewares/auth.middleware");

const router = express.Router();

// Route to create a budget
router.post("/budgets", authenticateUser, createBudget);

// Route to get all budgets for the logged-in user
router.get("/budgets", authenticateUser, getBudgets);

// Route to get a specific budget by ID
router.get("/budgets/:id", authenticateUser, getBudgetById);

// Route to delete a budget by ID
router.delete("/budgets/:id", authenticateUser, deleteBudget);

module.exports = router;
