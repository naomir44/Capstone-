import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { acceptFriendThunk, fetchFriendRequests } from "../../redux/friends";
import { FaUserPlus } from "react-icons/fa";
import './AcceptFriend.css';

const AcceptFriend = () => {
  const dispatch = useDispatch()
  const friendRequests = useSelector(state => state.friends.requests);
  const user = useSelector(state => state.session.user)

  useEffect(() => {
    if (user) {
        dispatch(fetchFriendRequests(user.id));
    }
}, [dispatch, user]);

const handleAccept = (friendshipId) => {
  dispatch(acceptFriendThunk(friendshipId)).then(() => {
    dispatch(fetchFriendRequests(user.id));
  });
};

  return (
    <div>
    <div className="friend-requests-header"><FaUserPlus />Friend Requests</div>
    {friendRequests?.length > 0 ? (
        friendRequests?.map(request => (
            <div key={request.friendship_id || request.id} className="friend-requests">
              {request.user_id !== user.id &&
              <>
                <span><img src={request.sender_profile_pic} alt="" className="friend-profile-picture"/></span>
                <span className="sender-name-requests">{request.sender_name}</span>
                <button className='accept-button' onClick={() => handleAccept(request.friendship_id)}>Accept</button>
              </>
              }
            </div>
        ))
    ) : (
        <p>No pending friend requests.</p>
    )}
</div>
  )
}

export default AcceptFriend;
