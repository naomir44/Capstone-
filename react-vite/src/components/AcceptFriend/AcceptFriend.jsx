import React, { useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { acceptFriendThunk, fetchFriendRequests } from "../../redux/friends";

const AcceptFriend = () => {
  const dispatch = useDispatch()
  const friendRequests = useSelector(state => state.friends.requests);
  const user = useSelector(state => state.session.user)

  // useEffect(() => {
  //   dispatch(fetchFriendRequests(user.id));
  // }, [dispatch]);

  useEffect(() => {
    if (user) {
      console.log("Fetching friend requests for user:", user.id);
        dispatch(fetchFriendRequests(user.id));
    }
}, [dispatch, user]);

useEffect(() => {
  console.log("Friend requests updated:", friendRequests);
}, [friendRequests]);

  const handleAccept = (friendshipId) => {
    console.log("Accepting friend request:", friendshipId);
    dispatch(acceptFriendThunk(friendshipId))
  }

  return (
    <div>
    <h2>Friend Requests</h2>
    {friendRequests.length > 0 ? (
        friendRequests.map(request => (
            <div key={request.id}>
              {request.user_id !== user.id &&
              <>
                <span>{request.sender_name}</span>
                <button onClick={() => handleAccept(request.id)}>Accept</button>
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
