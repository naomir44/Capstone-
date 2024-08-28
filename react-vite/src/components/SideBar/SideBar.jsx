import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfilePictureThunk, thunkLogout } from '../../redux/session';
import { NavLink, useNavigate } from 'react-router-dom';
import Groups from '../Groups/Groups';
import FriendsList from '../FriendsList/FriendsList';
import AcceptFriend from '../AcceptFriend/AcceptFriend';
import { IoHomeSharp } from "react-icons/io5";
import { BsCreditCardFill } from "react-icons/bs";
import { AiFillMessage } from "react-icons/ai";
import './SideBar.css';

const SideBar = ({ sidebarOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.session.user);
  const [newProfilePicture, setNewProfilePicture] = useState('');

  const handlePictureUpdate = async () => {
    if (newProfilePicture) {
      await dispatch(updateProfilePictureThunk(newProfilePicture));
      setNewProfilePicture('');
    }
  };

  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout());
    navigate('/');
  };

  return (
    <>
      {user &&
        <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className='profile'>
            <div className='profile-info'>
              <img
                src={user?.profile_picture}
                alt="Profile"
                className='profile-picture'
                onClick={() => {
                  const url = prompt("Enter the new profile picture URL:", user.profile_picture);
                  if (url) setNewProfilePicture(url);
                }}
              />
              <div className='name'>
                {user?.name}
              </div>
            </div>
            {newProfilePicture && (
              <button onClick={handlePictureUpdate}>Update Picture</button>
            )}
          </div>
         <div className='home-and-logout'>
         <div className='home-button'>
            <NavLink to="/"><IoHomeSharp className='home-icon' />Home</NavLink>
          </div>
          <div className='logout-button'>
            <button onClick={logout} className="navigation-button-logout">Log Out</button>
          </div>
         </div>
          <div className='balances-button'>
            <NavLink to={`/balances/${user?.id}/my-balance`}><BsCreditCardFill />Expenses</NavLink>
          </div>
          <div>
            <NavLink to="/chat"><AiFillMessage />Chat</NavLink>
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
      }
    </>
  );
};

export default SideBar;
