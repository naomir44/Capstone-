import { fetchGroupDeets } from "./groups";

const GET_EXPENSES = 'expenses/getExpenses';
const ADD_EXPENSE = 'expenses/addExpense';
const UPDATE_EXPENSE = 'expenses/updateExpense';
const DELETE_EXPENSE = 'expenses/deleteExpense';

const getExpenses = expenses => {
  return {
    type: GET_EXPENSES,
    expenses
  }
}

const addExpense = expense => {
  return {
    type: ADD_EXPENSE,
    expense
  }
}

const updateExpense = expense => {
  return {
    type: UPDATE_EXPENSE,
    expense
  }
}

const deleteExpense = expenseId => {
  return {
    type: DELETE_EXPENSE,
    expenseId
  }
}

export const fetchExpenses = (groupId) => async (dispatch) => {
  const response = await fetch(`/api/expenses/group/${groupId}/`);

  if (response.ok) {
      const expenses = await response.json();
      dispatch(getExpenses(expenses));
  } else {
      console.error('Failed to fetch expenses');
  }
};

export const addExpenseThunk = (expense, groupId) => async (dispatch) => {
  const response = await fetch('/api/expenses/new/', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(expense)
  });

  if (response.ok) {
      const newExpense = await response.json();
      dispatch(addExpense(newExpense));
      dispatch(fetchExpenses(groupId));
      dispatch(fetchGroupDeets(groupId));
  } else {
      console.error('Failed to add expense');
  }
};

export const updateExpenseThunk = (expenseId, updatedData) => async (dispatch) => {
  const response = await fetch(`/api/expenses/update/${expenseId}/`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData)
  });

  if (response.ok) {
      const updatedExpense = await response.json();
      dispatch(updateExpense(updatedExpense));
  } else {
      console.error('Failed to update expense');
  }
};

export const deleteExpenseThunk = (expenseId) => async (dispatch) => {
  const response = await fetch(`/api/expenses/delete/${expenseId}/`, {
      method: 'DELETE'
  });

  if (response.ok) {
      dispatch(deleteExpense(expenseId));
  } else {
      console.error('Failed to delete expense');
  }
};

const initialState = {
  list: []
};

const expensesReducer = (state = initialState, action) => {
  switch (action.type) {
      case GET_EXPENSES:
          return {
              ...state,
              list: action.expenses
          };
      case ADD_EXPENSE:
          return {
              ...state,
              list: [...state.list, action.expense]
          };
      case UPDATE_EXPENSE:
          return {
              ...state,
              list: state.list.map(expense =>
                  expense.id === action.expense.id ? action.expense : expense
              )
          };
      case DELETE_EXPENSE:
          return {
              ...state,
              list: state.list.filter(expense => expense.id !== action.expenseId)
          };
      default:
          return state;
  }
};

export default expensesReducer;
