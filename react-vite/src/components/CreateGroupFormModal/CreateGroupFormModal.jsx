import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createGroupThunk } from '../../redux/groups'
import './CreateGroupFormModal.css';

const CreateGroupFormModal = ({ showModal, setShowModal }) => {
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [members, setMembers] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newGroup = {
            name,
            description,
            members: members.split(',').map(email => email.trim()),
            image_url: imageUrl
        };

        dispatch(createGroupThunk(newGroup));
        setName('');
        setDescription('');
        setMembers('');
        setImageUrl('');
        setShowModal(false);
    };

    if (!showModal) return null;

    return (
        <div className="create-group-modal-background">
            <div className="create-group-modal-content">
                <button className="create-group-close-btn" onClick={() => setShowModal(false)}>&times;</button>
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
                    <label>
                        Description:
                        <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.vale)}
                        />
                    </label>
                    <label>
                        Members (comma-separated emails or usernames):
                        <input
                            type="text"
                            value={members}
                            onChange={(e) => setMembers(e.target.value)}
                        />
                    </label>
                    <label>
                        Group Image URL:
                        <input
                            type="text"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                        />
                    </label>
                    <button type="submit">Create Group</button>
                </form>
            </div>
        </div>
    );
};

export default CreateGroupFormModal;
