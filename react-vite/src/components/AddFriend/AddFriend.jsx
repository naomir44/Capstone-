import { useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFriendThunk, fetchFriendRequests, fetchFriends } from "../../redux/friends";
import './AddFriend.css';
import { useModal } from "../../context/Modal";

const AddFriend = () => {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const user = useSelector(state => state.session.user)
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await dispatch(addFriendThunk(email))
    if (response.error) {
      setError(response.error)
    } else {
      setEmail('')
      setError('')
      closeModal()
      await dispatch(fetchFriendRequests(user.id))
      await dispatch(fetchFriends(user.id))
    }
  };
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={closeModal}>&times;</button>
        <form onSubmit={handleSubmit} className="add-friend-section">
          <label className="add-friend-label">
            Friend&apos;s Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="add-friend-input"
              placeholder="Enter email address"
            />
          </label>
          <button type="submit" className="add-friend-button">Add Friend</button>
          {error && <p className="add-friend-error">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default AddFriend;
