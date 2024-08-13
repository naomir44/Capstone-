import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchGroupDeets } from "../../redux/groups";
import UpdateGroupFormModal from "../UpdateGroupFormModal/UpdateGroupFormModal";
import DeleteGroupModal from "../DeleteGroupModal/DeleteGroupModal";
import UpdateExpenseForm from "../UpdateExpenseForm/UpdateExpenseForm";
import AddExpenseFormModal from "../AddExpenseFormModal/AddExpenseFormModal";
import './GroupDetails.css';
import DeleteExpenseModal from "../DeleteExpenseModal/DeleteExpenseModal";

const GroupDetails = () => {
    let { groupId } = useParams();
    groupId = +groupId;
    const group = useSelector(state => state.groups[groupId]);
    const currentUser = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
    const [deleteExpenseId, setDeleteExpenseId] = useState(null);

    useEffect(() => {
        dispatch(fetchGroupDeets(groupId));
    }, [dispatch, groupId]);

    if (!group) {
        return <h1>Loading...</h1>;
    }

    const handleUpdateGroupClick = () => {
        setShowUpdateModal(true);
    };

    const handleDeleteGroupClick = () => {
        setShowDeleteModal(true);
    };

    const handleAddExpenseClick = () => {
        setShowAddExpenseModal(true);
    };

    const handleDeleteExpenseClick = (expenseId) => {
        setDeleteExpenseId(expenseId);
    };

    const handleCloseDeleteExpenseModal = () => {
        setDeleteExpenseId(null);
    };

    return (
        <div className="group-deets-container">
            <div className="group-deets-header">
                <div className="group-picture-container">
                    <img src={group.image_url} alt="Group" className="group-picture" />
                </div>
                <div className="group-info">
                    <h2 className="group-name-in-group-deets">{group.name}</h2>
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

            <div className="expenses-section-group-deets">
                <h3>Expenses</h3>
                <button onClick={handleAddExpenseClick}>Add Expense</button>
                <AddExpenseFormModal showModal={showAddExpenseModal} setShowModal={setShowAddExpenseModal} groupId={groupId} />
                {group.expenses.length > 0 ? (
                    group.expenses.map(expense => (
                        <div key={expense.id} className="expense-item-in-group-deets">
                            <div className="expense-details-in-group-deets">
                                <span>{expense.description}: ${expense.amount}</span>
                                <UpdateExpenseForm expense={expense} groupId={groupId}/>
                                <button onClick={() => handleDeleteExpenseClick(expense.id)}>Delete Expense</button>
                                {deleteExpenseId === expense.id && (
                                    <DeleteExpenseModal showModal={deleteExpenseId === expense.id} setShowModal={handleCloseDeleteExpenseModal} expenseId={expense.id} groupId={groupId}/>
                                )}
                            </div>
                            <div className="payments-in-group-deets">
                                <h4>Payments</h4>
                                {expense.payments.length > 0 ? (
                                    expense.payments.map(payment => (
                                        <div key={payment.id} className="payment-item">
                                            <span>Payer: {payment.payer_id}</span>
                                            <span>Payee: {payment.payee_id}</span>
                                            <span>Amount: ${payment.amount}</span>
                                            <span>Status: {payment.status}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p>No payments yet.</p>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No expenses added yet.</p>
                )}
            </div>

            <UpdateGroupFormModal showModal={showUpdateModal} setShowModal={setShowUpdateModal} groupId={groupId} />
            <DeleteGroupModal showModal={showDeleteModal} setShowModal={setShowDeleteModal} groupId={groupId} />
        </div>
    );
};

export default GroupDetails;
