import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Groups from '../Groups/Groups';
import CreateGroupFormModal from '../CreateGroupFormModal/CreateGroupFormModal';
import FriendsList from '../FriendsList/FriendsList';
import AddFriend from '../AddFriend/AddFriend';
import './SideBar.css';
import AcceptFriend from '../AcceptFriend/AcceptFriend';

const SideBar = () => {
  const [showModal, setShowModal] = useState(false);

  const handleCreateGroupClick = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  return (
    <>
      <div className='sidebar'>
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <a href="#" onClick={handleCreateGroupClick}>Create New Group</a>
          </li>
        </ul>
        <ul>
          <li>
            <Groups />
          </li>
        </ul>
        <ul>
          <li>
            <AcceptFriend />
          </li>
        </ul>
        <ul>
          <li>
            <FriendsList />
          </li>
        </ul>
        <ul>
          <li>
            <AddFriend />
          </li>
        </ul>
      </div>
      <CreateGroupFormModal showModal={showModal} setShowModal={setShowModal} />
    </>
  );
};

export default SideBar;
