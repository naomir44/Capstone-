import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchGroupDeets } from "../../redux/groups";
import UpdateGroupFormModal from "../UpdateGroupFormModal/UpdateGroupFormModal";
import DeleteGroupModal from "../DeleteGroupModal/DeleteGroupModal";
import './GroupDetails.css'

const GroupDetails = () => {
  let { groupId } = useParams()
  groupId = +groupId
  const group = useSelector(state => state.groups[groupId])
  const currentUser = useSelector(state => state.session.user)
  const dispatch = useDispatch()
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  console.log(currentUser)

  useEffect(() => {
    dispatch(fetchGroupDeets(groupId))
  },[dispatch, groupId])

  if (!group) {
    return <h1>Loading...</h1>
  }

  const handleUpdateGroupClick = () => {
    setShowUpdateModal(true)
  };

const handleDeleteGroupClick = () => {
  setShowDeleteModal(true)
}

if (!group) {
  return <h1>Loading...</h1>
}
  return (
    <div className="group-deets-container">
      <div>{group.creator.name}</div>
      <div>
        {group.expenses.map(expense => (
          <div key={expense.id}>
            {expense.amount}
          </div>
        ))}
      </div>
      <div>
        {group.members.map(member => (
          <div key={member.id}>
            {member.user.name}
          </div>
        ))}
      </div>
      {currentUser.id === group.created_by && (
        <>
          <button onClick={handleUpdateGroupClick}>Update Group</button>
          <button onClick={handleDeleteGroupClick}>Delete Group</button>
          </>
      )}
      <UpdateGroupFormModal showModal={showUpdateModal} setShowModal={setShowUpdateModal} groupId={groupId} />
      <DeleteGroupModal showModal={showDeleteModal} setShowModal={setShowDeleteModal} groupId={groupId} />
    </div>
  );
}

export default GroupDetails;
