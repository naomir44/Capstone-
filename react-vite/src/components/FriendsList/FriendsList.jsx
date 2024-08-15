import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFriends, deleteFriendThunk } from '../../redux/friends';
import './FriendsList.css';
import { FaUserFriends } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import AddFriend from '../AddFriend/AddFriend';
import OpenModalButton from '../OpenModalButton/OpenModalButton';

const FriendsList = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const friends = useSelector(state => state.friends.list);

    const requestPending = (friend) => {
        const friendship = friend.friendships?.find(f => f.friend_id === user?.id || f.user_id === user?.id);
        return friendship?.status === 'pending';
    }

    useEffect(() => {
        dispatch(fetchFriends());
    }, [dispatch]);

    const handleDelete = (friendId) => {
        dispatch(deleteFriendThunk(friendId));
    };

    return (
        <div className="friends-container">
          <div className='friends-header'><FaUserFriends />Friends
          <div className='open-add-friend-button-div'>
          <OpenModalButton
        modalComponent={<AddFriend />}
        buttonText='Add Friend'
        /></div>
        </div>
          {friends.length > 0 ? (
            <div className="friends-list">
              {friends?.map(friend => (
                <div key={friend.id} className="friend-item">
                  {!requestPending(friend) && (
                    <>
                    <img className='friend-profile-picture' src={friend.profile_picture} />
                      <span className="friend-name">{friend.name}</span>
                      <button className="delete-button" onClick={() => handleDelete(friend.id)}>
                      <TiDelete />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-friends-message">You have no friends added yet.</p>
          )}
        </div>
      );
};

export default FriendsList;
