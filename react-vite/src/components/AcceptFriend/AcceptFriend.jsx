import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { acceptFriendThunk, fetchFriendRequests } from "../../redux/friends";
import { FaUserPlus } from "react-icons/fa";

const AcceptFriend = () => {
  const dispatch = useDispatch()
  const friendRequests = useSelector(state => state.friends.requests);
  const user = useSelector(state => state.session.user)

  // useEffect(() => {
  //   dispatch(fetchFriendRequests(user.id));
  // }, [dispatch]);

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
    <div><FaUserPlus />Friend Requests</div>
    {friendRequests?.length > 0 ? (
        friendRequests?.map(request => (
            <div key={request.id}>
              {request.user_id !== user.id &&
              <>
                <span>{request.sender_name}</span>
                <button onClick={() => handleAccept(request.friendship_id)}>Accept</button>
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
