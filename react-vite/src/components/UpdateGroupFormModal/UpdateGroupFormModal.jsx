import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { updateGroupThunk } from '../../redux/groups';
import './UpdateGroupFormModal.css';

const UpdateGroupFormModal = ({ showModal, setShowModal }) => {
    const { groupId } = useParams();
    const dispatch = useDispatch();
    const group = useSelector(state => state.groups[groupId]);
    const [name, setName] = useState(group ? group.name : '');

    useEffect(() => {
        if (group) {
            setName(group.name);
        }
    }, [group]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedGroup = { name };
        dispatch(updateGroupThunk(groupId, updatedGroup));
        setShowModal(false);
    };

    if (!showModal) return null;

    return (
        <div className="update-group-modal-background">
            <div className="update-group-modal-content">
                <button className="update-group-close-btn" onClick={() => setShowModal(false)}>&times;</button>
                <form onSubmit={handleSubmit}>
                    <label>
                        Group Name:
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit">Update Group</button>
                </form>
            </div>
        </div>
    );
};

export default UpdateGroupFormModal;
