import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateGroupThunk } from '../../redux/groups';
import './UpdateGroupFormModal.css';
import { useModal } from '../../context/Modal';

const UpdateGroupFormModal = ({ groupId }) => {
    const dispatch = useDispatch();
    const group = useSelector(state => state.groups[groupId]);
    const friends = useSelector(state => state.session.user.friendships);
    const currentUser = useSelector(state => state.session.user)
    const acceptedFriends = friends.filter(friend => friend.status === "accepted")
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const { closeModal } = useModal()

    useEffect(() => {
        if (group) {
            setName(group.name || '');
            setDescription(group.description || '');
            setSelectedFriends(group.members ? group.members.map(member => member.user_id) : []);
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
        closeModal()
    };

    const handleFriendSelection = (friendId) => {
        setSelectedFriends(prev =>
            prev.includes(friendId)
                ? prev.filter(id => id !== friendId)
                : [...prev, friendId]
        );
    };

    const getFriendName = (friend) => {
        if (friend.user_id === currentUser.id) {
            return friend.friend_name;
        } else {
            return friend.sender_name;
        }
    };


    return (
        <div className="update-group-modal-background">
            <div className="update-group-modal-content">
                <button className="update-group-close-btn" onClick={() => closeModal()}>&times;</button>
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
                        {acceptedFriends.map(friend => {
                            const friendId = friend.user_id === currentUser.id ? friend.friend_id : friend.user_id;
                            return (
                                <div key={friend.id}>
                                    <input
                                        type="checkbox"
                                        checked={selectedFriends.includes(friendId)}
                                        onChange={() => handleFriendSelection(friendId)}
                                    />
                                    {getFriendName(friend)}
                                </div>
                            );
                        })}
                    </div>
                    <button type="submit">Update Group</button>
                </form>
            </div>
        </div>
    );
};

export default UpdateGroupFormModal;
