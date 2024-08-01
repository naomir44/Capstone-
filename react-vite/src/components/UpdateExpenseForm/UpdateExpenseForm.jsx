import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateExpenseThunk } from '../../redux/expense';

const UpdateExpenseForm = ({ expense }) => {
    const dispatch = useDispatch();
    const [description, setDescription] = useState(expense.description);
    const [amount, setAmount] = useState(expense.amount);
    const [date, setDate] = useState(expense.date);
    const [splitMethod, setSplitMethod] = useState(expense.split_method);
    const [showForm, setShowForm] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedExpense = {
            id: expense.id,
            group_id: expense.group_id,
            description,
            amount: parseFloat(amount),
            date,
            split_method: splitMethod
        };
        dispatch(updateExpenseThunk(updatedExpense));
        setShowForm(false);
    };

    return (
        <div>
            <button onClick={() => setShowForm(!showForm)}>
                {showForm ? "Cancel" : "Update"}
            </button>
            {showForm && (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Description:</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Amount:</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Date:</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Split Method:</label>
                        <select value={splitMethod} onChange={(e) => setSplitMethod(e.target.value)}>
                            <option value="equal">Equal</option>
                            <option value="exact">Exact</option>
                        </select>
                    </div>
                    <button type="submit">Update Expense</button>
                </form>
            )}
        </div>
    );
};


export default UpdateExpenseForm;
