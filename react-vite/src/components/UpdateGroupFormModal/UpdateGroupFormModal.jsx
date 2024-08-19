import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateGroupThunk } from '../../redux/groups';
import './UpdateGroupFormModal.css';
import { useModal } from '../../context/Modal';

const UpdateGroupFormModal = ({ groupId }) => {
    const dispatch = useDispatch();
    const group = useSelector(state => state.groups[groupId]);
    const user = useSelector(state => state.session.user)
    const friends = useSelector(state => state.session.user.friendships);
    const currentUser = useSelector(state => state.session.user)
    const acceptedFriends = friends.filter(friend => friend.status === "accepted")
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal()
console.log(acceptedFriends)
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
        const validationErrors = {}

        if (name.trim().length === 0) validationErrors.name = 'Give your group a name';
        if (description.trim().length === 0) validationErrors.description = 'Provide a description for your group';
        if (selectedFriends.length === 0) validationErrors.selectedFriends = 'Select friends to be apart of your group';

        const isValidUrl = (imageUrl) => {
            try {
                new URL(imageUrl);
                return true;
            } catch {
                return false;
            }
        };
        if (!imageUrl.trim() || !isValidUrl(imageUrl.trim())) validationErrors.imageUrl = 'Add a valid group image';

        if (Object.values(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        } else {
            const updatedGroup = {
                name,
                description,
                members: selectedFriends,
                image_url: imageUrl
            };

            dispatch(updateGroupThunk(groupId, updatedGroup));
            closeModal();
        }
    }

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
        user.id === group.created_by ? (
            <div className="update-group-modal-background">
                <div className="update-group-modal-content">
                    <h1 className='update-group-header'>Update Group</h1>
                    <button className="update-group-close-btn" onClick={() => closeModal()}>&times;</button>
                    <form onSubmit={handleSubmit}>
                        <label className="update-group-modal-label">
                            Group Name
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="update-group-modal-input"
                            />
                        </label>
                        {errors.name && <p className='form-errors'>{errors.name}</p>}
                        <label className="update-group-modal-label">
                            Description
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="update-group-modal-textarea"
                            />
                        </label>
                        {errors.description && <p className='form-errors'>{errors.description}</p>}
                        <label className="update-group-modal-label">
                            Group Image URL
                            <input
                                type="text"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                className="update-group-modal-input"
                            />
                        </label>
                        {errors.imageUrl && <p className='form-errors'>{errors.imageUrl}</p>}
                        <div className="update-group-modal-friend-selection">
                            <h3 className="update-group-modal-selection-heading">Select Friends to Add:</h3>
                            <div className="update-group-modal-friends-options">
                                {acceptedFriends.map(friend => {
                                    const friendId = friend.user_id === currentUser.id ? friend.friend_id : friend.user_id;
                                    return (
                                        <div
                                            key={friend.id}
                                            className={`update-group-modal-friend-option ${selectedFriends.includes(friendId) ? 'selected' : ''}`}
                                            onClick={() => handleFriendSelection(friendId)}
                                        >
                                            <img src={friend.friend_id !== user.id ? (friend.profile_picture || '/default-profile.png') : (friend.sender_profile_pic || '/default-profile.png')} alt={getFriendName(friend)} />
                                            <span>{getFriendName(friend)}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        {errors.selectedFriends && <p className='form-errors'>{errors.selectedFriends}</p>}
                        <button type="submit" className="update-group-modal-submit-button">Update Group</button>
                    </form>
                </div>
            </div>) :
            <div className="update-group-modal-background">
                <div className="update-group-modal-content">
                    <h1 className='update-group-header'>Add Friends to Group</h1>
                    <button className="update-group-close-btn" onClick={() => closeModal()}>&times;</button>
                    <form onSubmit={handleSubmit}>
                        <div className="update-group-modal-friend-selection">
                            <h3 className="update-group-modal-selection-heading">Select Friends to Add:</h3>
                            <div className="update-group-modal-friends-options">
                                {acceptedFriends.map(friend => {
                                    if (friend.user_id !== group.created_by && friend.friend_id !== group.created_by) {
                                        const friendId = friend.user_id === currentUser.id ? friend.friend_id : friend.user_id;
                                        return (
                                            <div
                                                key={friend.id}
                                                className={`update-group-modal-friend-option ${selectedFriends.includes(friendId) ? 'selected' : ''}`}
                                                onClick={() => handleFriendSelection(friendId)}
                                            >
                                                <img src={friend.profile_picture || '/default-profile.png'} alt={getFriendName(friend)} />
                                                <span>{getFriendName(friend)}</span>
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                        </div>
                        {errors.selectedFriends && <p className='form-errors'>{errors.selectedFriends}</p>}
                        <button type="submit" className="update-group-modal-submit-button">Update Group</button>
                    </form>
                </div>
            </div>
    );
};

export default UpdateGroupFormModal;
