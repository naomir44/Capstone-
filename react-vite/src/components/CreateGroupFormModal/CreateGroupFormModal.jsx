import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createGroupThunk } from '../../redux/groups'
import './CreateGroupFormModal.css';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../context/Modal';

const CreateGroupFormModal = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const friends = useSelector(state => state.session.user.friendships)
    const currentUser = useSelector(state => state.session.user);
    const acceptedFriends = friends.filter(friend => friend.status === "accepted");
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    // const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // const validationErrors = {}


        const newGroup = {
            name,
            description,
            members: selectedFriends,
            image_url: imageUrl
        };

        const response = await dispatch(createGroupThunk(newGroup));
        if (response) {
            setName('');
            setDescription('')
            setSelectedFriends([])
            setImageUrl('')
            closeModal()
            navigate(`/groups/${response.id}`)
        } else {
            console.log('Failed to create group')
        }
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
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-btn" onClick={closeModal}>&times;</button>
            <form onSubmit={handleSubmit} className="create-group-form">
              <label className="form-label">
                Group Name:
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="form-input"
                  placeholder="Enter group name"
                />
              </label>
              <label className="form-label">
                Description:
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-textarea"
                  placeholder="Enter group description"
                />
              </label>
              <label className="form-label">
                Group Image URL:
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="form-input"
                  placeholder="Enter image URL"
                />
              </label>
              <div className="friend-selection">
                <h3 className="selection-heading">Select Friends to Add:</h3>
                <div className="friends-options">
                  {acceptedFriends.map(friend => {
                    const friendId = friend.user_id === currentUser.id ? friend.friend_id : friend.user_id;
                    return (
                      <div
                        key={friend.id}
                        className={`friend-option ${selectedFriends.includes(friendId) ? 'selected' : ''}`}
                        onClick={() => handleFriendSelection(friendId)}
                      >
                        <img src={friend.profile_picture || '/default-profile.png'} alt={getFriendName(friend)} />
                        <span>{getFriendName(friend)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <button type="submit" className="submit-button">Create Group</button>
            </form>
          </div>
        </div>
      );
};

export default CreateGroupFormModal;
