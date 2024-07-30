import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { fetchGetGroups } from '../../redux/groups'

const Groups = () => {
  const groups = useSelector(state => Object.values(state.groups))
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchGetGroups())
  },[dispatch])
  return (
    <>
   <div>Your Groups</div>
    {groups.map(group => (
      <>
      <div>
        <NavLink to={`/groups/${group.id}`}>{group.name}</NavLink>
      </div>
      </>
    ))}
    </>
  )
}

export default Groups;
