import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { fetchGetGroups } from '../../redux/groups'
import { HiUserGroup } from "react-icons/hi2";
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import CreateGroupFormModal from '../CreateGroupFormModal/CreateGroupFormModal';
import './Groups.css';

const Groups = () => {
  const currentUser = useSelector(state => state.session.user)
  const groups = useSelector(state => Object.values(state.groups))
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchGetGroups())
  },[dispatch])

  const userGroups = groups?.filter(group =>
    group.created_by === currentUser?.id ||
    group.members.some(member => member.user_id === currentUser?.id)
);
  return (
    <>
      <div className='groups-header'><HiUserGroup />Groups
        <div className='open-create-group-modal-button-div'>
       <OpenModalButton
        modalComponent={<CreateGroupFormModal/>}
        buttonText='New group'
        /></div>
        </div>
      {userGroups.map(group => (
        <div className='group-list' key={group.id}>
        <img className='friend-profile-picture' src={group.image_url} alt="" />
        <div className='group-name' key={group.id}>
          <NavLink className='group-name-link' to={`/groups/${group.id}`}>{group.name}</NavLink>
        </div>
        </div>
      ))}
    </>
  );
}

export default Groups;
