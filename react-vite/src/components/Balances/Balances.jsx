import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBalance, fetchPayExpense } from '../../redux/balance';
import './Balances.css';
import OpenModalButton from '../OpenModalButton';
import DeleteExpenseModal from '../DeleteExpenseModal/DeleteExpenseModal';
import UpdateExpenseForm from '../UpdateExpenseForm/UpdateExpenseForm';

const Balances = ({ isSidebarOpen }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const balance = useSelector(state => state.balances.balance);
  const [showEditOptions, setShowEditOptions] = useState(null);

  useEffect(() => {
    dispatch(fetchBalance());
  }, [dispatch]);

  const toggleEditOptions = (expenseId) => {
    setShowEditOptions(prevState => (prevState === expenseId ? null : expenseId));
  };

  const handlePayExpense = async (expenseId) => {
    const payment = { status: 'paid' };
    await dispatch(fetchPayExpense(payment, expenseId));
    await dispatch(fetchBalance());
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
  };

  const sortByDateDescending = (a, b) => {
    return new Date(a.date) - new Date(b.date);
  };

  return (
    <div
      className={`balances-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
    >
      <h1 className='expenses-header'>{user.name}&apos;s Expenses</h1>
      <div className="expenses-section">
        <h3>Expenses You Owe</h3>
        {balance?.expenses_you_owe.length > 0 ? (
          balance.expenses_you_owe
            .sort(sortByDateDescending)
            .map(expense => (
              <div key={expense.id} className="expense-you-owe-item">
                <div className="expense-details">
                  <span>{expense.description}</span>
                  <span>Pay By: {expense.date}</span>
                  <span className="expense-amount">
                    {expense.payments
                      .filter(payment => payment.payee_id === user?.id)
                      .map(payment => `$${payment.amount.toFixed(2)}`)
                      .join(', ')}
                  </span>
                  <button onClick={() => handlePayExpense(expense.id)} className="pay-button">
                    Pay
                  </button>
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
          balance.expenses_owed_to_you
            .sort(sortByDateDescending)
            .map(expense => (
              <div key={expense.id} className="expense-owed-to-you-item">
                <div className="expense-details">
                  <span>{expense.description}</span>
                  <span className='due-date'> Due Date: {expense.date}</span>
                  <button onClick={() => toggleEditOptions(expense.id)} className="expense-dropdown-btn">
                    Edit
                  </button>
                  {showEditOptions === expense.id && (
                    <div className="expense-dropdown-content">
                      <div className='expense-edit-button-div'>
                        <OpenModalButton
                          buttonText="Update"
                          modalComponent={<UpdateExpenseForm expense={expense} />}
                          onButtonClick={() => setShowEditOptions(null)}
                        />
                      </div>
                      <div className='expense-edit-button-div'>
                        <OpenModalButton
                          buttonText="Delete"
                          modalComponent={<DeleteExpenseModal expenseId={expense.id} />}
                          onButtonClick={() => setShowEditOptions(null)}
                        />
                      </div>
                    </div>
                  )}
                </div>
                {expense.payments.map(payment => (
                  <div key={payment.id} className="expense-payment">
                    <span>{payment.payee} owes ${payment.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            ))
        ) : (
          <p>No one owes you anything at the moment.</p>
        )}
        <h4>Total Expenses Owed to You: ${calculateTotalOwedToYou(balance?.expenses_owed_to_you || []).toFixed(2)}</h4>
      </div>
      <div className="balances-card">
        <h2>My Balance</h2>
        {balance && (
          <>
            <p>Total Paid: ${balance.total_paid.toFixed(2)}</p>
            <p>Total Owed: ${balance.total_owed.toFixed(2)}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Balances;
