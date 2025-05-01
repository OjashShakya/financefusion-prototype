const express = require("express");
const {
    createIncome,
    getIncomes,
    getIncomeById,
    deleteIncome,
    deleteAllIncomes
} = require("../controller/income.controller");
const authenticateUser  = require("../middlewares/auth.middleware"); // Middleware for user authentication

const router = express.Router();

// Route to create an income
router.post("/incomes", authenticateUser, createIncome);

// Route to get all incomes for the logged-in user
router.get("/incomes", authenticateUser, getIncomes);

// Route to get a specific income by ID
router.get("/incomes/:id", authenticateUser, getIncomeById);

// Route to delete an income by ID
router.delete("/incomes/:id", authenticateUser, deleteIncome);

// Route to delete all incomes
router.delete("/incomes", authenticateUser, deleteAllIncomes);

module.exports = router;