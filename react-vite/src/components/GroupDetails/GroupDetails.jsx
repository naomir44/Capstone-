import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchGroupDeets } from "../../redux/groups";
import AddExpenseFormModal from "../AddExpenseFormModal/AddExpenseFormModal";
import UpdateGroupFormModal from "../UpdateGroupFormModal/UpdateGroupFormModal";
import DeleteGroupModal from "../DeleteGroupModal/DeleteGroupModal";
import OpenModalButton from '../OpenModalButton'
import './GroupDetails.css';

const GroupDetails = () => {
    let { groupId } = useParams();
    const dispatch = useDispatch();
    const group = useSelector(state => state.groups[groupId]);
    const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
    const [showEditOptions, setShowEditOptions] = useState(false);

    useEffect(() => {
        dispatch(fetchGroupDeets(groupId));
    }, [dispatch, groupId]);

    if (!group) {
        return <h1>Loading...</h1>;
    }

    const handleAddExpenseClick = () => {
        setShowAddExpenseModal(true);
    };

    const toggleEditOptions = () => {
        setShowEditOptions(!showEditOptions);
    };

    return (
        <div className="group-deets-container">
            <div className="group-deets-header">
                <div className="group-picture-container">
                    <img src={group.image_url} alt="Group" className="group-picture" />
                </div>
                <div className="group-info">
                    <div className="group-name-edit-container">
                        <h2 className="group-name-in-group-deets">{group.name}</h2>
                        <div className={`group-actions-dropdown ${showEditOptions ? 'show' : ''}`}>
                            <button onClick={toggleEditOptions} className="dropdown-btn">
                                Edit
                            </button>
                            {showEditOptions && (
                                <div className="dropdown-content">
                                    {console.log("Dropdown is rendered")}
                                    <OpenModalButton
                                    buttonText="Update"
                                    modalComponent={<UpdateGroupFormModal groupId={groupId}/>}
                                    />
                                   <OpenModalButton
                                   buttonText='Delete'
                                   modalComponent={<DeleteGroupModal groupId={groupId}/>}
                                   />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="group-members-overview">
                        <div className="group-member-avatars">
                            {group.members?.slice(0, 5).map(member => (
                                <img
                                    key={member.id}
                                    src={member.member.profile_picture}
                                    alt={member.member.name}
                                    className="member-avatar"
                                />
                            ))}
                            {group.members?.length > 5 && (
                                <div className="more-members">
                                    +{group.members.length - 5}
                                </div>
                            )}
                        </div>
                        <div className="group-member-names">
                            {group.members?.map(member => member.member.name).join(", ")}
                        </div>
                    </div>
                </div>
            </div>

            <div className="payments-feed">
                <h3>Payments Feed</h3>
                {group.expenses.length > 0 ? (
                    group.expenses.map(expense => (
                        <div key={expense.id} className="payment-item">
                            <div>{expense.description}</div>
                            <div>Total: {expense.amount}</div>
                            {expense.payments.map(payment => (
                               <div key={payment.id}>
                                {payment.payer} paid {payment.payee} ${payment.amount.toFixed(2)}
                               </div>
                            ))}
                        </div>
                    ))
                ) : (
                    <p>No payments made yet.</p>
                )}
            </div>

            <button onClick={handleAddExpenseClick}>Add Expense</button>
            <AddExpenseFormModal showModal={showAddExpenseModal} setShowModal={setShowAddExpenseModal} groupId={groupId} />
        </div>
    );
};

export default GroupDetails;
