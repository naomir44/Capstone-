const GET_BALANCE = 'balances/getBalance'

const getBalances = balance => {
  return {
    type: GET_BALANCE,
    balance
  }
}

export const fetchBalance = () => async (dispatch) => {
    const response = await fetch('/api/expenses/my-balance/');
    console.log(response)
    if (response.ok) {
      const data = await response.json();
      console.log(data)
      dispatch(getBalances(data));
      return data
    }
};

const initialState = {};

export default function balanceReducer(state = initialState, action) {
  switch (action.type) {
    case GET_BALANCE:
      return {
        ...state,
        balance: action.balance
      };
    default:
      return state;
  }
}
