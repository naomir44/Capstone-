import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFriends, deleteFriendThunk } from '../../redux/friends';

const FriendsList = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const friends = useSelector(state => state.friends.list);

    const requestPending = (friend) => {
        const friendship = friend.friends?.find(f => f.friend_id === user.id || f.user_id === user.id);
        return friendship?.status === 'pending';
    }

    useEffect(() => {
        dispatch(fetchFriends());
    }, [dispatch]);

    const handleDelete = (friendId) => {
        dispatch(deleteFriendThunk(friendId));
    };

    return (
        <div>
            <h2>Your Friends</h2>
            {friends.length > 0 ? (
                friends.map(friend => (
                    <div key={friend.id}>
                        {!requestPending(friend) && (
                            <>
                                <span>{friend.name}</span>
                                <button onClick={() => handleDelete(friend.id)}>Delete</button>
                            </>
                        )}
                    </div>
                ))
            ) : (
                <p>You have no friends added yet.</p>
            )}
        </div>
    );
};

export default FriendsList;
