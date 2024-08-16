import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBalance, fetchPayExpense } from '../../redux/balance';
import './Balances.css';
import OpenModalButton from '../OpenModalButton';
import DeleteExpenseModal from '../DeleteExpenseModal/DeleteExpenseModal';
import UpdateExpenseForm from '../UpdateExpenseForm/UpdateExpenseForm';

const Balances = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const balance = useSelector(state => state.balances.balance);
  const [showEditOptions, setShowEditOptions] = useState(false);

  useEffect(() => {
    dispatch(fetchBalance());
  }, [dispatch]);

  const toggleEditOptions = () => {
    setShowEditOptions(!showEditOptions);
};

  const handlePayExpense = async (expenseId) => {
    const payment = {status: 'paid'}
    await dispatch(fetchPayExpense(payment, expenseId))
    await dispatch(fetchBalance())
  };

  const calculateTotalYouOwe = (expenses) => {
    return expenses.reduce((total, expense) => {
      const userPayments = expense.payments.filter(payment => payment.payee_id === user.id);
      const userTotal = userPayments.reduce((sum, payment) => sum + payment.amount, 0);
      return total + userTotal;
    }, 0);
  };

  const calculateTotalOwedToYou = (expenses) => {
    return expenses.reduce((total, expense) => {
      const userPayments = expense.payments.filter(payment => payment.payee_id !== user.id);
      const userTotal = userPayments.reduce((sum, payment) => sum + payment.amount, 0);
      return total + userTotal;
    }, 0);
  }

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
              <span>{expense.description}</span>
              <div>
                {expense.payments.map(payment => (
                  payment.payee_id === user?.id && (
                  <div key={payment.id}>
                    ${payment.amount.toFixed(2)}
                    </div>
                 )
                ))}
              </div>
              <div className="expense-actions">
                <button onClick={() => handlePayExpense(expense.id)}>Pay</button>
              </div>
            </div>
          ))
        ) : (
          <p>You owe nothing at the moment.</p>
        )}
        <h4>Total Expenses You Owe: ${calculateTotalYouOwe(balance?.expenses_you_owe || []).toFixed(2)}</h4>
      </div>

      <div className="expenses-section">
        <h3>Expenses Owed to You</h3>
        {balance?.expenses_owed_to_you.length > 0 ? (
          balance.expenses_owed_to_you.map(expense => (
            <div key={expense.id} className="expense-item">
              <div>{expense.description}</div>
              {expense.payments.map(payment => (
                <div key={payment.id}>
                <span> ${payment.amount.toFixed(2)}</span>
                <span>Owed by: {payment.payee}</span>
                </div>
              ))}
              <div className={`expense-actions-dropdown ${showEditOptions ? 'show' : ''}`}>
                            <button onClick={toggleEditOptions} className="expense-dropdown-btn">
                                Edit
                            </button>
                            {showEditOptions && (
                                <div className="expense-dropdown-content">
                                    <OpenModalButton
                                    buttonText="Update"
                                    modalComponent={<UpdateExpenseForm expense={expense}/>}
                                    />
                                   <OpenModalButton
                                   buttonText='Delete'
                                   modalComponent={<DeleteExpenseModal expenseId={expense.id}/>}
                                   />
                                </div>
                            )}
                        </div>
            </div>
          ))
        ) : (
          <p>No one owes you anything at the moment.</p>
        )}
        <h4>Total Expenses Owed to You: ${calculateTotalOwedToYou(balance?.expenses_owed_to_you || []).toFixed(2)}</h4>
      </div>
    </div>
  );
}

export default Balances;
