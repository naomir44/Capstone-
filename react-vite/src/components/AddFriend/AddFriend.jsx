import React, { useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFriendThunk, fetchFriendRequests } from "../../redux/friends";

const AddFriend = () => {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const user = useSelector(state => state.session.user)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await dispatch(addFriendThunk(email))
    if (response.error) {
      setError(response.error)
    } else {
      setEmail('')
      setError('')
      dispatch(fetchFriendRequests(user.id))
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Friend's Email:
        <input type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <button type="submit">Add Friend</button>
      {error && <p className="add-friend-error">{error}</p>}
    </form>
  )
}

export default AddFriend;
