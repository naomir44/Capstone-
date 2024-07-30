import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateGroupThunk } from '../../redux/groups';
import './UpdateGroupFormModal.css';

const UpdateGroupFormModal = ({ showModal, setShowModal, groupId }) => {
    const dispatch = useDispatch();
    const group = useSelector(state => state.groups[groupId]);
    const friends = useSelector(state => state.session.user.friends);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [imageUrl, setImageUrl] = useState('');


    useEffect(() => {
        if (group) {
            setName(group.name || '');
            setDescription(group.description || '');
            setSelectedFriends(group.members ? group.members.map(member => member.id) : []);
            setImageUrl(group.image_url || '');
        }
    }, [group]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedGroup = {
            name,
            description,
            members: selectedFriends,
            image_url: imageUrl
        };

        dispatch(updateGroupThunk(groupId, updatedGroup));
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
                    <button type="submit">Update Group</button>
                </form>
            </div>
        </div>
    );
};

export default UpdateGroupFormModal;
