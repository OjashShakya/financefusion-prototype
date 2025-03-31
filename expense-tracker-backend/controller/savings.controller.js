const mongoose = require("mongoose");
const Savings = require("../models/savings.model"); // Ensure path matches your project structure
const { StatusCodes } = require("http-status-codes");

// Create a new Savings
const createSavings = async (req, res) => {
    try {
      const { name, target_amount, initial_amount, date } = req.body;
  
      // Validate required fields
      if (!name || !target_amount || !initial_amount) {
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
      });
  
      const savedSavings = await newSavings.save();
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
      
    //   console.log("Saving user:",savings.user)
    //     console.log("Logged-in user:",req.user.id)
      // Ensure the logged-in user owns this savings entry
      if (savings.user.toString() === req.user.id) {
        return res.status(StatusCodes.FORBIDDEN).json({
          message: "Not authorized to update this savings",
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
  
      res.status(StatusCodes.OK).json({
        message: "Amount added successfully",
        savings,
      });
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
    const savings = await Savings.find({ user: req.user.id }).sort({ date: -1 });
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

    const Savings = await Savings.findById(id);

    if (!Savings) return res.status(StatusCodes.NOT_FOUND).json({ message: "Savings not found" });

    if (Savings.user.toString() !== req.user.id) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: "Not authorized to delete this Savings" });
    }

    await Savings.deleteOne();
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
