import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBalance, fetchPayExpense } from '../../redux/balance';
import './Balances.css';

const Balances = () => {
  const dispatch = useDispatch();
  const balance = useSelector((state) => state.balances.balance);

  useEffect(() => {
    dispatch(fetchBalance());
  }, [dispatch]);

  const handlePayExpense = async (expenseId) => {
    const payment = {status: 'paid'}
    await dispatch(fetchPayExpense(payment, expenseId))
    await dispatch(fetchBalance())
  };

  const calculateTotal = (expenses) => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  return (
    <div className="balances-container">
      <div className="balances-card">
        <h2>My Balance</h2>
        {balance && (
          <>
            <p>Total Paid: ${balance.total_paid.toFixed(2)}</p>
            <p>Total Owed: ${balance.total_owed.toFixed(2)}</p>
          </>
        )}
      </div>

      <div className="expenses-section">
        <h3>Expenses You Owe</h3>
        {balance?.expenses_you_owe.length > 0 ? (
          balance.expenses_you_owe.map(expense => (
            <div key={expense.id} className="expense-item">
              <span>{expense.description}: ${expense.amount.toFixed(2)}</span>
              <div className="expense-actions">
                <button onClick={() => handlePayExpense(expense.id)}>Pay</button>
              </div>
            </div>
          ))
        ) : (
          <p>You owe nothing at the moment.</p>
        )}
        <h4>Total Expenses You Owe: ${calculateTotal(balance?.expenses_you_owe || []).toFixed(2)}</h4>
      </div>

      <div className="expenses-section">
        <h3>Expenses Owed to You</h3>
        {balance?.expenses_owed_to_you.length > 0 ? (
          balance.expenses_owed_to_you.map(expense => (
            <div key={expense.id} className="expense-item">
              <span>{expense.description}: ${expense.amount.toFixed(2)}</span>
              <span>Owed by: {expense.payer}</span>
            </div>
          ))
        ) : (
          <p>No one owes you anything at the moment.</p>
        )}
        <h4>Total Expenses Owed to You: ${calculateTotal(balance?.expenses_owed_to_you || []).toFixed(2)}</h4>
      </div>
    </div>
  );
}

export default Balances;
