import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchExpenses, deleteExpenseThunk } from '../../redux/expenses';
import UpdateExpenseForm from "../UpdateExpenseForm/UpdateExpenseForm";
import AddExpenseFormModal from "../AddExpenseFormModal/AddExpenseFormModal";

const ExpenseList = ({ groupId }) => {
  const dispatch = useDispatch();
  const expenses = useSelector(state => state.expenses.list);

  console.log(expenses)

  useEffect(() => {
      dispatch(fetchExpenses(groupId));
  }, [dispatch, groupId]);

  const handleDelete = (expenseId) => {
      dispatch(deleteExpenseThunk(expenseId));
  };

  return (
      <div>
          <h2>Expenses</h2>
          <AddExpenseFormModal groupId={groupId} />
          {expenses.length > 0 ? (
              expenses.map(expense => (
                  <div key={expense.id} className="expense-item">
                      <span>{expense.description}: ${expense.amount}</span>
                      <UpdateExpenseForm expense={expense} />
                      <button onClick={() => handleDelete(expense.id)}>Delete</button>
                  </div>
              ))
          ) : (
              <p>No expenses added yet.</p>
          )}
      </div>
  );
};

export default ExpenseList;
