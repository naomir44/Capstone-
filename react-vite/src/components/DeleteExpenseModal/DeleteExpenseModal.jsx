import { useDispatch } from 'react-redux';
import { deleteExpenseThunk } from '../../redux/expense';
import './DeleteExpenseModal.css';
import { fetchGroupDeets } from '../../redux/groups';

const DeleteExpenseModal = ({ showModal, setShowModal, expenseId, groupId }) => {
    const dispatch = useDispatch();

    const handleDelete = async () => {
      await dispatch(deleteExpenseThunk(expenseId));
            setShowModal(false);
            dispatch(fetchGroupDeets(groupId))
    };

    if (!showModal) return null;

    return (
        <div className="delete-expense-modal-background">
            <div className="delete-expense-modal-content">
                <h2 className='confirm-expense-deletion-btn'>Confirm Delete</h2>
                <p className='confirm-expense-deletion-question'>Are you sure you want to delete this expense?</p>
                <button className='yes-delete-expense-btn' onClick={handleDelete}>Yes, Delete</button>
                <button className='no-dont-delete-expense' onClick={() => setShowModal(false)}>Cancel</button>
            </div>
        </div>
    );
};

export default DeleteExpenseModal;
