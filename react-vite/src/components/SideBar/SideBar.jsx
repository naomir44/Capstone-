import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfilePictureThunk } from '../../redux/session';
import { NavLink } from 'react-router-dom';
import Groups from '../Groups/Groups';
import FriendsList from '../FriendsList/FriendsList';
import AcceptFriend from '../AcceptFriend/AcceptFriend';
import { IoHomeSharp } from "react-icons/io5";
import { BsCreditCardFill } from "react-icons/bs";
import './SideBar.css';

const SideBar = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const [newProfilePicture, setNewProfilePicture] = useState('');
  console.log(user)

  const handlePictureUpdate = async () => {
    if (newProfilePicture) {
      await dispatch(updateProfilePictureThunk(newProfilePicture));
      setNewProfilePicture(''); // Reset the input field
    }
  };

  return (
    <>
      <div className='sidebar'>
      <div className='profile'>
          <div className='profile-info'>
            <img
              src={user.profile_picture}
              alt="Profile"
              className='profile-picture'
              onClick={() => {
                const url = prompt("Enter the new profile picture URL:", user.profile_picture);
                if (url) setNewProfilePicture(url);
              }}
            />
            <div className='name'>
              {user.name}
            </div>
          </div>
          {newProfilePicture && (
            <button onClick={handlePictureUpdate}>Update Picture</button>
          )}
        </div>
        <div className='home-button'>
          <NavLink to="/"><IoHomeSharp className='home-icon'/>Home</NavLink>
        </div>
        <div className='balances-button'>
          <NavLink to={`/balances/${user.id}/my-balance`}><BsCreditCardFill />Balances</NavLink>
        </div>
        <div className='groups'>
          <Groups />
        </div>
        <div>
          <FriendsList />
        </div>
        <div className='friend-requests-on-sidebar'>
          <AcceptFriend />
        </div>
      </div>
    </>
  );
};

export default SideBar;
