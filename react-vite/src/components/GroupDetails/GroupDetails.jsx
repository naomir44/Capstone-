import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchGroupDeets } from "../../redux/groups";
import './GroupDetails.css'

const GroupDetails = () => {
  let { groupId } = useParams()
  groupId = +groupId
  const group = useSelector(state => state.groups[groupId])
  const dispatch = useDispatch()
console.log(group)

  useEffect(() => {
    dispatch(fetchGroupDeets(groupId))
  },[dispatch, groupId])

  if (!group) {
    return <h1>Loading...</h1>
  }

  return (
   <div className="group-deets-container">
      <div>{group.creator.name}</div>
      <div>{group.expenses.map(expense => (
        <>
        <div>
        {expense.amount}
        </div>
        </>
      ))}</div>
      <div>{group.members.map(member => (
        <>
        {member.user.name}
        </>
      ))}</div>
   </div>
  )
}

export default GroupDetails;
