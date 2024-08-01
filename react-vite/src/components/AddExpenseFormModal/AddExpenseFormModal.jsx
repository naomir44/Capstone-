import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addExpenseThunk } from '../../redux/expense';
import './AddExpenseFormModal.css';
import { fetchGroupDeets } from '../../redux/groups';

const AddExpenseFormModal = ({ showModal, setShowModal, groupId }) => {
    const dispatch = useDispatch();
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [splitMethod, setSplitMethod] = useState('equal');

    const handleSubmit = (e) => {
        e.preventDefault();
        const newExpense = {
            group_id: +groupId,
            description: description,
            amount: parseFloat(amount),
            date: date,
            split_method: splitMethod
        };
        dispatch(addExpenseThunk(newExpense, groupId));
        dispatch(fetchGroupDeets(groupId))
        setDescription('');
        setAmount('');
        setDate('');
        setSplitMethod('equal');
        setShowModal(false);
    };

    if (!showModal) return null;

    return (
        <div className="add-expense-modal-background">
            <div className="add-expense-modal-content">
                <button className="close-btn-in-add-expense" onClick={() => setShowModal(false)}>&times;</button>
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
                    <button type="submit">Add Expense</button>
                </form>
            </div>
        </div>
    );
};

export default AddExpenseFormModal;
