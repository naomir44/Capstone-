import { useDispatch } from 'react-redux';
import { deleteExpenseThunk } from '../../redux/expense';
import './DeleteExpenseModal.css';
import { useModal } from '../../context/Modal';

const DeleteExpenseModal = ({ expenseId }) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDelete = async () => {
      await dispatch(deleteExpenseThunk(expenseId));
      closeModal()
    };

    return (
        <div className="delete-expense-modal-background">
            <div className="delete-expense-modal-content">
            <button className="modal-close-btn" onClick={closeModal}>&times;</button>
                <h2 className='confirm-expense-deletion-btn'>Confirm Delete</h2>
                <p className='confirm-expense-deletion-question'>Are you sure you want to delete this expense?</p>
                <button className='yes-delete-expense-btn' onClick={handleDelete}>Yes, Delete</button>
                <button className='no-dont-delete-expense' onClick={() => closeModal()}>Cancel</button>
            </div>
        </div>
    );
};

export default DeleteExpenseModal;
