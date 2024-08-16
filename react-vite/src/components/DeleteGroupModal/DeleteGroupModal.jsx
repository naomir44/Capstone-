import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteGroupThunk } from '../../redux/groups';
import './DeleteGroupModal.css';
import { useModal } from '../../context/Modal';

const DeleteGroupModal = ({ groupId }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { closeModal } = useModal();

    const handleDelete = async () => {
        await dispatch(deleteGroupThunk(groupId));
            navigate('/')
            closeModal();
    };

    return (
        <div className="delete-group-modal-background">
            <div className="delete-group-modal-content">
                <h2 className='confirm-group-deletion-btn'>Confirm Delete</h2>
                <p className='confirm-group-deletion-question'>Are you sure you want to delete this group?</p>
                <button className='yes-delete-group-btn' onClick={handleDelete}>Yes, Delete</button>
                <button className='no-dont-delete-group' onClick={() => closeModal()}>Cancel</button>
            </div>
        </div>
    );
};

export default DeleteGroupModal;
