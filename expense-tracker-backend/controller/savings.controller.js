const mongoose = require("mongoose");
const Savings = require("../models/savings.model"); // Ensure path matches your project structure
const { StatusCodes } = require("http-status-codes");

// Create a new Savings
const createSavings = async (req, res) => {
    try {
      const { name, target_amount, initial_amount, date, color } = req.body;
      
      console.log('Received savings creation request:', {
        name,
        target_amount,
        initial_amount,
        date,
        color,
        user: req.user.id
      });
  
      // Validate required fields
      if (!name || !target_amount || !initial_amount) {
        console.log('Missing required fields:', {
          hasName: !!name,
          hasTargetAmount: !!target_amount,
          hasInitialAmount: !!initial_amount
        });
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Name, target amount, and initial amount are required",
        });
      }
  
      // Check if a savings goal with the same name exists
      const existingSavings = await Savings.findOne({ user: req.user.id, name });
  
      if (existingSavings) {
        return res.status(StatusCodes.CONFLICT).json({
          message: "A savings goal with this name already exists",
        });
      }
  
      const newSavings = new Savings({
        user: req.user.id,
        name,
        target_amount,
        initial_amount,
        date: date || Date.now(),
        color: color || "#0088FE"
      });
  
      const savedSavings = await newSavings.save();
      console.log('Successfully created savings goal:', savedSavings);
      res.status(StatusCodes.CREATED).json(savedSavings);
    } catch (err) {
      console.error("Error creating Savings:", err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Error creating Savings",
        error: err.message,
      });
    }
  };

const updateSavings = async (req, res) => {
    try {
      const { amount, date } = req.body;
      const { id } = req.params; // Savings ID from URL
  
      // Validate required fields
      if (!amount) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Amount is required",
        });
      }
  
      // Validate Savings ID format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Invalid Savings ID",
        });
      }
     
      // Find the savings entry by ID
      let savings = await Savings.findById(id);
  
      if (!savings) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Savings goal not found",
        });
      }
      
      // Convert both IDs to strings for comparison
      const savingsUserId = savings.user.toString();
      const currentUserId = req.user.id.toString();

      // Ensure the logged-in user owns this savings entry
      if (savingsUserId !== currentUserId) {
        console.log("User ID mismatch:", {
          savingsUserId,
          currentUserId,
          savingsUser: savings.user,
          currentUser: req.user.id
        });
        return res.status(StatusCodes.FORBIDDEN).json({
          message: "Not authorized to update this savings",
          details: "User ID mismatch"
        });
      }
  
      const currentAmount = parseFloat(savings.initial_amount);
      const newAmount = parseFloat(amount);
  
      if (isNaN(currentAmount) || isNaN(newAmount)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Invalid amount values",
        });
      }
  
      // Update the savings amount
      savings.initial_amount = currentAmount + newAmount; // Add the new amount to the current amount
      savings.date = date || Date.now(); // Update last modified date
      await savings.save();
  
      // Return the complete savings goal object
      res.status(StatusCodes.OK).json(savings);
    } catch (err) {
      console.error("Error updating Savings:", err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Error updating Savings",
        error: err.message,
      });
    }
  };
  
  
  
// Get all savings for the logged-in user
const getsavings = async (req, res) => {
  try {
    const savings = await Savings.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(StatusCodes.OK).json(savings);
  } catch (err) {
    console.error("Error fetching savings:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error fetching savings",
      error: err.message,
    });
  }
};

// Get a specific Savings by ID
const getSavingsById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid Savings ID" });
    }

    const Savings = await Savings.findById(id);

    if (!Savings) return res.status(StatusCodes.NOT_FOUND).json({ message: "Savings not found" });

    if (Savings.user.toString() !== req.user.id) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: "Not authorized to view this Savings" });
    }

    res.status(StatusCodes.OK).json(Savings);
  } catch (err) {
    console.error("Error fetching Savings:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error fetching Savings",
      error: err.message,
    });
  }
};

// Delete an Savings
const deleteSavings = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid Savings ID" });
    }

    const savings = await Savings.findById(id);

    if (!savings) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Savings not found" });
    }

    // Convert both IDs to strings for comparison
    const savingsUserId = savings.user.toString();
    const currentUserId = req.user.id.toString();

    if (savingsUserId !== currentUserId) {
      console.log("User ID mismatch:", {
        savingsUserId,
        currentUserId,
        savingsUser: savings.user,
        currentUser: req.user.id
      });
      return res.status(StatusCodes.FORBIDDEN).json({ 
        message: "Not authorized to delete this Savings",
        details: "User ID mismatch"
      });
    }

    await savings.deleteOne();
    res.status(StatusCodes.OK).json({ message: "Savings deleted successfully" });
  } catch (err) {
    console.error("Error deleting Savings:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error deleting Savings",
      error: err.message,
    });
  }
};

module.exports = {
  createSavings,
  getsavings,
  updateSavings,
  getSavingsById,
  deleteSavings,
};
