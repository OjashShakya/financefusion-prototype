const updateSavingsGoal = async (id: string, amount: number) => {
  try {
    if (amount <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    // Get the current savings goal
    const goal = savingsGoals.find(g => g._id === id);
    if (!goal) {
      toast.error('Savings goal not found');
      return;
    }

    // Calculate the new total amount
    const newTotal = goal.initial_amount + amount;

    // Update the savings goal with the new total
    await savingsApi.updateSavings(id, { amount: newTotal });

    // Create a new savings transaction
    await savingsApi.createSavingsTransaction({
      savings_id: id,
      amount: amount,
      type: 'contribution',
      date: new Date()
    });

    // Refresh the savings goals
    await fetchSavingsGoals();
    toast.success('Successfully added to savings goal');
  } catch (error) {
    console.error('Error updating savings goal:', error);
    toast.error('Failed to update savings goal');
  }
}; 