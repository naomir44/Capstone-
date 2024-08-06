import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteGroupThunk } from '../../redux/groups';
import './DeleteGroupModal.css';

const DeleteGroupModal = ({ showModal, setShowModal, groupId }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleDelete = async () => {
        await dispatch(deleteGroupThunk(groupId));
            setShowModal(false);
            navigate('/')
    };

    if (!showModal) return null;

    return (
        <div className="delete-group-modal-background">
            <div className="delete-group-modal-content">
                <h2 className='confirm-group-deletion-btn'>Confirm Delete</h2>
                <p className='confirm-group-deletion-question'>Are you sure you want to delete this group?</p>
                <button className='yes-delete-group-btn' onClick={handleDelete}>Yes, Delete</button>
                <button className='no-dont-delete-group' onClick={() => setShowModal(false)}>Cancel</button>
            </div>
        </div>
    );
};

export default DeleteGroupModal;
