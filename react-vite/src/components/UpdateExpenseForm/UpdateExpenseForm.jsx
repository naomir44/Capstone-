import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateExpenseThunk } from '../../redux/expense';
import { useModal } from '../../context/Modal';
import './UpdateExpenseForm.css';

const UpdateExpenseForm = ({ expense }) => {
    const dispatch = useDispatch();
    const group = useSelector(state => state.groups[expense.group_id]);
    const [description, setDescription] = useState(expense.description);
    const [amount, setAmount] = useState(expense.amount);
    const [date, setDate] = useState(expense.date);
    const [splitMethod, setSplitMethod] = useState(expense.split_method);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [customShares, setCustomShares] = useState({});
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    useEffect(() => {
        const members = [];
        const shares = {};

        expense.payments.forEach(payment => {
            members.push(payment.payee_id);
            shares[payment.payee_id] = payment.amount;
        });

        setSelectedMembers(members);
        setCustomShares(shares);
    }, [expense]);

    const handleMemberToggle = (memberId) => {
        if (selectedMembers.includes(memberId)) {
            setSelectedMembers(selectedMembers.filter(id => id !== memberId));
            setCustomShares(prevShares => {
                const newShares = { ...prevShares };
                delete newShares[memberId];
                return newShares;
            });
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
        const updatedExpense = {
            description,
            amount: parseFloat(amount),
            date,
            split_method: splitMethod,
            members: selectedMembers,
            ...(splitMethod === 'exact' && { shares: customShares })
        };
        dispatch(updateExpenseThunk(updatedExpense, expense.id));
        closeModal();
    }
    };

    return (
        <div className="update-expense-modal-background">
            <div className="update-expense-modal-content">
                <button className="close-btn-in-update-expense" onClick={() => closeModal()}>&times;</button>
                <h2>Update Expense</h2>
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
                            {group?.members.map(member => (
                                <div
                                    key={member.id}
                                    className={`member-option ${selectedMembers.includes(member.user_id) ? 'selected' : ''}`}
                                    onClick={() => handleMemberToggle(member.user_id)}
                                >
                                    <img src={member.member.profile_picture} alt={member.member.name} />
                                    <span>{member.member.name}</span>
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
                            {selectedMembers?.map(memberId => {
                                const member = group.members?.find(m => m.user_id === memberId);
                                return (
                                    <div key={memberId} className="custom-share-input">
                                        <label>{member?.member.name}</label>
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
                    <button className="submit-btn" type="submit">Update Expense</button>
                </form>
            </div>
        </div>
    );
};

export default UpdateExpenseForm;
