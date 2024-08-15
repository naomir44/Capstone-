import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addExpenseThunk } from '../../redux/expense';
import './AddExpenseFormModal.css';
import { fetchGroupDeets } from '../../redux/groups';

const AddExpenseFormModal = ({ showModal, setShowModal, groupId }) => {
    const dispatch = useDispatch();
    const group = useSelector(state => state.groups[groupId]);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [splitMethod, setSplitMethod] = useState('equal');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [payerId, setPayerId] = useState(null);

    useEffect(() => {
        if (group && group.members.length > 0) {
            setPayerId(group.members[0].id); // Default payer to the first member in the list
        }
    }, [group]);

    const handleMemberToggle = (memberId) => {
        if (selectedMembers.includes(memberId)) {
            setSelectedMembers(selectedMembers.filter(id => id !== memberId));
        } else {
            setSelectedMembers([...selectedMembers, memberId]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newExpense = {
            group_id: +groupId,
            description,
            amount: parseFloat(amount),
            date,
            split_method: splitMethod,
            payer_id: payerId,
            members: selectedMembers,
        };
        dispatch(addExpenseThunk(newExpense, groupId));
        dispatch(fetchGroupDeets(groupId));
        setDescription('');
        setAmount('');
        setDate('');
        setSplitMethod('equal');
        setSelectedMembers([]);
        setPayerId(null);
        setShowModal(false);
    };

    if (!showModal) return null;

    return (
        <div className="add-expense-modal-background">
            <div className="add-expense-modal-content">
                <button className="close-btn-in-add-expense" onClick={() => setShowModal(false)}>&times;</button>
                <h2>New Expense</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <label>Description</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-row">
                        <label>Amount</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-row">
                        <label>Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-row">
                        <label>Paid by</label>
                        <select value={payerId} onChange={(e) => setPayerId(e.target.value)} required>
                            {group?.members.map(member => (
                                <option key={member.id} value={member.id}>
                                    {member.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-row">
                        <label>Split Method</label>
                        <div className="split-options">
                            <button
                                type="button"
                                className={splitMethod === 'equal' ? 'active' : ''}
                                onClick={() => setSplitMethod('equal')}
                            >
                                Equally
                            </button>
                            <button
                                type="button"
                                className={splitMethod === 'exact' ? 'active' : ''}
                                onClick={() => setSplitMethod('exact')}
                            >
                                Exact
                            </button>
                        </div>
                    </div>
                    <div className="form-row">
                        <label>Select Members</label>
                        <div className="members-options">
                            {group?.members.map(member => (
                                <div
                                    key={member.id}
                                    className={`member-option ${selectedMembers.includes(member.id) ? 'selected' : ''}`}
                                    onClick={() => handleMemberToggle(member.id)}
                                >
                                    <img src={member.profile_picture} alt={member.name} />
                                    <span>{member.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button className="submit-btn" type="submit">Add Expense</button>
                </form>
            </div>
        </div>
    );
};

export default AddExpenseFormModal;
