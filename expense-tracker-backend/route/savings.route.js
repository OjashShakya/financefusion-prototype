const express = require("express");
const {
  createSavings,
  updateSavings,
  getsavings,
  getSavingsById,
  deleteSavings,
} = require("../controller/savings.controller"); 
const authenticateUser = require("../middlewares/auth.middleware");

const router = express.Router();

// Route to create a new savings goal
router.post("/savings", authenticateUser, createSavings);

// Route to update an existing savings goal (add money)
router.patch("/savings/:id", authenticateUser, updateSavings);

// Route to get all savings for the logged-in user
router.get("/savings", authenticateUser, getsavings);

// Route to get a specific savings goal by ID
router.get("/savings/:id", authenticateUser, getSavingsById);

// Route to delete a savings goal
router.delete("/savings/:id", authenticateUser, deleteSavings);

module.exports = router;
