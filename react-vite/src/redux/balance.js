const GET_BALANCE = 'balances/getBalance'
const PAY_EXPENSE = 'balances/payExpense'

const getBalances = balance => {
  return {
    type: GET_BALANCE,
    balance
  }
}

const payExpense = expense => {
  return {
    type: PAY_EXPENSE,
    expense
  }
}

export const fetchBalance = () => async (dispatch) => {
    const response = await fetch('/api/expenses/my-balance/');
    if (response.ok) {
      const data = await response.json();
      dispatch(getBalances(data));
      return data
    }
};

export const fetchPayExpense = (expense, expense_id) => async (dispatch) => {
  const response = await fetch(`/api/expenses/pay/${expense_id}/`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(expense)
  })
  if (response.ok) {
    const data = await response.json()
    dispatch(payExpense(data))
    return data
  }
}

const initialState = {};

export default function balanceReducer(state = initialState, action) {
  switch (action.type) {
    case GET_BALANCE:
      return {
        ...state,
        balance: action.balance
      };
      case PAY_EXPENSE:{
        const updatedExpensesYouOwe = state.balance.expenses_you_owe.map(expense => {
          if (expense.id === action.expense.expense_id) {
            const updatedPayments = expense.payments.map(payment => {
              if (payment.id === action.expense.id) {
                return {
                  ...payment,
                  ...action.expense
                };
              }
              return payment;
            });

            return {
              ...expense,
              payments: updatedPayments
            };
          }
          return expense;
        });

        return {
          ...state,
          balance: {
            ...state.balance,
            expenses_you_owe: updatedExpensesYouOwe
          }
        }
      }
    default:
      return state;
  }
}
