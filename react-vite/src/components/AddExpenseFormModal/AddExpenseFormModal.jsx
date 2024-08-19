import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addExpenseThunk } from '../../redux/expense';
import './AddExpenseFormModal.css';
import { fetchGroupDeets } from '../../redux/groups';
import { useModal } from '../../context/Modal';

const AddExpenseFormModal = ({ groupId }) => {
    const dispatch = useDispatch();
    const group = useSelector(state => state.groups[groupId]);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [splitMethod, setSplitMethod] = useState('equal');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [customShares, setCustomShares] = useState({});
    const { closeModal } = useModal();
    const [errors, setErrors] = useState({});
    const user = useSelector(state => state.session.user);

    const handleMemberToggle = (memberId) => {
        if (selectedMembers.includes(memberId)) {
            setSelectedMembers(selectedMembers.filter(id => id !== memberId));
        } else {
            setSelectedMembers([...selectedMembers, memberId]);
        }
    };
    const handleCustomShareChange = (memberId, value) => {
        setCustomShares({
            ...customShares,
            [memberId]: parseFloat(value) || 0,
        });
    };

    const groupMembers = []
    if (group.creator.name !== user.name) {
        groupMembers.push(group.creator)
    }
    group.members.forEach(member => {
        if (member.member.name !== user.name) {
            groupMembers.push(member.member)
        }
    })

    const validateForm = () => {
        const validationErrors = {}

        if (description.trim().length === 0) validationErrors.description = "Give this expense a description";
        if (amount.trim().length === 0) validationErrors.amount = "Provide an amount for this expense";
        if (!date) validationErrors.date = "Tell members when this expense need to be paid";
        if (!splitMethod) validationErrors.splitMethod = "How do you want to split this expense";
        if (selectedMembers.length === 0) validationErrors.selectedMembers = "Select members to split this expense with";

        return validationErrors
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm()

        if (Object.values(validationErrors).length > 0) {
            setErrors(validationErrors);
            return
        } else {
            const newExpense = {
            group_id: +groupId,
            description,
            amount: parseFloat(amount),
            date,
            split_method: splitMethod,
            payer_id: user.id,
            members: selectedMembers,
            ...(splitMethod === 'exact' && { shares: customShares })
        };
        dispatch(addExpenseThunk(newExpense, groupId));
        dispatch(fetchGroupDeets(groupId));
        setDescription('');
        setAmount('');
        setDate('');
        setSplitMethod('equal');
        setSelectedMembers([]);
        setCustomShares({})
        closeModal();
        }
    };

    return (
        <div className="add-expense-modal-background">
            <div className="add-expense-modal-content">
                <button className="close-btn-in-add-expense" onClick={() => closeModal()}>&times;</button>
                <h2>New Expense</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <label>Description</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    {errors.description && <p className='form-errors'>{errors.description}</p>}
                    <div className="form-row">
                        <label>Amount</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                    {errors.amount && <p className='form-errors'>{errors.amount}</p>}
                    <div className="form-row">
                        <label>Pay By</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    {errors.date && <p className='form-errors'>{errors.date}</p>}
                    <div className="form-row">
                        <label>Who do you want to split this expense with?</label>
                        <div className="members-options">
                            {groupMembers.map(member => (
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
                    {errors.selectedMembers && <p className='form-errors'>{errors.selectedMembers}</p>}
                    <div className="form-row">
                        <label>How do you want to split your expense?</label>
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
                                Custom
                            </button>
                        </div>
                    </div>
                    {splitMethod === 'exact' && (
                        <div className="form-row custom-split">
                            {selectedMembers.map(memberId => {
                                const member = group.members.find(m => m.user_id === memberId);
                                return (
                                    <div key={memberId} className="custom-share-input">
                                        <label>{member.member.name}</label>
                                        <input
                                            type="number"
                                            value={customShares[memberId] || ''}
                                            onChange={(e) => handleCustomShareChange(memberId, e.target.value)}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {errors.splitMethod && <p className='form-errors'>{errors.splitMethod}</p>}
                    <button className="submit-btn" type="submit">Add Expense</button>
                </form>
            </div>
        </div>
    );
};

export default AddExpenseFormModal;
