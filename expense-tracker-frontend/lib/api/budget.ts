import { Budget } from "@/types/finance";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Helper function to get headers with auth token
const getHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error("No authentication token found");
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export async function getBudgets(): Promise<Budget[]> {
  try {
    const response = await fetch(`${API_URL}/dashboard/budgets`, {
      credentials: "include",
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized error
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error("Session expired. Please log in again.");
      }
      throw new Error("Failed to fetch budgets");
    }
    
    const data = await response.json();
    return data.map((budget: any) => ({
      id: budget._id,
      category: budget.category,
      amount: budget.amount,
      spent: budget.spent || 0, // Default to 0 if not provided
      period: budget.period.toLowerCase() as 'weekly' | 'monthly' | 'yearly',
    }));
  } catch (error) {
    console.error("Error fetching budgets:", error);
    throw error;
  }
}

export async function createBudget(budget: Omit<Budget, "id" | "spent">): Promise<Budget> {
  try {
    const response = await fetch(`${API_URL}/dashboard/budgets`, {
      method: "POST",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify({
        category: budget.category,
        amount: budget.amount,
        period: budget.period.charAt(0).toUpperCase() + budget.period.slice(1), // Capitalize first letter
      }),
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized error
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error("Session expired. Please log in again.");
      }
      throw new Error("Failed to create budget");
    }
    
    const data = await response.json();
    return {
      id: data._id,
      category: data.category,
      amount: data.amount,
      spent: data.spent || 0, // Default to 0 if not provided
      period: data.period.toLowerCase() as 'weekly' | 'monthly' | 'yearly',
    };
  } catch (error) {
    console.error("Error creating budget:", error);
    throw error;
  }
}

export async function deleteBudget(id: string): Promise<void> {
  try {
    if (!id) {
      throw new Error("Budget ID is required for deletion");
    }

    const response = await fetch(`${API_URL}/dashboard/budgets/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
      credentials: "include",
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized error
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error("Session expired. Please log in again.");
      }
      if (response.status === 403) {
        throw new Error("You are not authorized to delete this budget");
      }
      throw new Error("Failed to delete budget");
    }
  } catch (error) {
    console.error("Error deleting budget:", error);
    throw error;
  }
} 