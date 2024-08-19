import { useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFriendThunk, fetchFriendRequests, fetchFriends } from "../../redux/friends";
import './AddFriend.css';
import { useModal } from "../../context/Modal";
import { useParams } from "react-router-dom";
import { fetchGroupDeets } from "../../redux/groups";

const AddFriend = () => {
  const dispatch = useDispatch()
  const { groupId } = useParams()
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState('')
  const user = useSelector(state => state.session.user)
  const { closeModal } = useModal();

  const friendExists = user.friendships.some(friendship => friendship.friend_email === email);
  const friendRequestSent = user.friendships.some(friendship => friendship.status === 'pending');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {}

    if (email.trim().length === 0) validationErrors.email = 'Provide a valid email';
    if (friendExists) validationErrors.email = 'You are already friends with this user';
    if (friendRequestSent) validationErrors.email = 'You have already sent a friend request to this user';

    if (Object.values(validationErrors).length > 0) {
      setErrors(validationErrors)
  } else {
    const response = await dispatch(addFriendThunk(email))
    if (response) {
      setEmail('')
      closeModal()
      await dispatch(fetchFriendRequests(user.id))
      await dispatch(fetchFriends(user.id))
      if (groupId) {
        await dispatch(fetchGroupDeets(groupId))
      }
    }
  }
  };
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={closeModal}>&times;</button>
        <form onSubmit={handleSubmit} className="add-friend-section">
          <label className="add-friend-label">
            User&apos;s Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="add-friend-input"
              placeholder="Enter email address"
            />
          </label>
          {errors.email && <p className="form-errors">{errors.email}</p>}
          <button type="submit" className="add-friend-button">Add Friend</button>
        </form>
      </div>
    </div>
  );
}

export default AddFriend;
