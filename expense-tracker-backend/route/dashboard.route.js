const express = require("express");
const {
    createExpense,
    getExpenses,
    getExpenseById,
    deleteExpense,
    deleteAllExpenses
} = require("../controller/dashboard.controller");
const authenticateUser  = require("../middlewares/auth.middleware"); // Middleware for user authentication

const router = express.Router();
// Route to create an expense
router.post("/expenses", authenticateUser, createExpense);

// Route to get all expenses for the logged-in user
router.get("/expenses", authenticateUser, getExpenses);

// Route to get a specific expense by ID
router.get("/expenses/:id", authenticateUser, getExpenseById);

// Route to delete an expense by ID
router.delete("/expenses/:id", authenticateUser, deleteExpense);

// Route to delete all expenses
router.delete("/expenses", authenticateUser, deleteAllExpenses);

module.exports = router;
