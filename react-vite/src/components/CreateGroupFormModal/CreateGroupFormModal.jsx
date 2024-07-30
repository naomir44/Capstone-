import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createGroupThunk } from '../../redux/groups'
import './CreateGroupFormModal.css';

const CreateGroupFormModal = ({ showModal, setShowModal }) => {
    const dispatch = useDispatch();
    const friends = useSelector(state => state.session.user.friends)
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [imageUrl, setImageUrl] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newGroup = {
            name,
            description,
            members: selectedFriends,
            image_url: imageUrl
        };
        console.log(newGroup)

        dispatch(createGroupThunk(newGroup));
        setName('');
        setDescription('');
        setSelectedFriends([]);
        setImageUrl('');
        setShowModal(false);
    };

    const handleFriendSelection = (friendId) => {
        setSelectedFriends(prev =>
            prev.includes(friendId)
                ? prev.filter(id => id !== friendId)
                : [...prev, friendId]
        );
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
                        onChange={(e) => setDescription(e.target.value)}
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
                    <div>
                        <h3>Select Friends to Add:</h3>
                        {friends.map(friend => (
                            <div key={friend.id}>
                                <input
                                    type="checkbox"
                                    checked={selectedFriends.includes(friend.id)}
                                    onChange={() => handleFriendSelection(friend.id)}
                                />
                                {friend.friend_name}
                            </div>
                        ))}
                    </div>
                    <button type="submit">Create Group</button>
                </form>
            </div>
        </div>
    );
};

export default CreateGroupFormModal;
