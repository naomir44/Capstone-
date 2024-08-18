import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchGroupDeets } from "../../redux/groups";
import AddExpenseFormModal from "../AddExpenseFormModal/AddExpenseFormModal";
import UpdateGroupFormModal from "../UpdateGroupFormModal/UpdateGroupFormModal";
import DeleteGroupModal from "../DeleteGroupModal/DeleteGroupModal";
import OpenModalButton from '../OpenModalButton';
import './GroupDetails.css';

const GroupDetails = () => {
    let { groupId } = useParams();
    const dispatch = useDispatch();
    const group = useSelector(state => state.groups[groupId]);
    const [showEditOptions, setShowEditOptions] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        dispatch(fetchGroupDeets(groupId));
    }, [dispatch, groupId]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setTimeout(() => {
                    setShowEditOptions(false);
                }, 100);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    if (!group) {
        return <h1>Loading...</h1>;
    }

    const toggleEditOptions = () => {
        setShowEditOptions(!showEditOptions);
    };

    const sortByDateDescending = (a, b) => {
        return new Date(b.date) - new Date(a.date);
    };

    return (
        <>
        <div className="group-deets-container">
            <div className="group-deets-header">
                <div className="group-picture-container">
                    <img src={group.image_url} alt="Group" className="group-picture" />
                </div>
                <div className="group-info">
                    <div className="group-name-edit-container">
                        <h2 className="group-name-in-group-deets">{group.name}</h2>
                        <div ref={dropdownRef} className={`group-actions-dropdown ${showEditOptions ? 'show' : ''}`}>
                            <button onClick={toggleEditOptions} className="dropdown-btn">
                                Edit
                            </button>
                            {showEditOptions && (
                                <div className="dropdown-content">
                                    <OpenModalButton
                                        buttonText="Update Group"
                                        modalComponent={<UpdateGroupFormModal groupId={groupId} />}
                                    />
                                    <OpenModalButton
                                        buttonText='Delete Group'
                                        modalComponent={<DeleteGroupModal groupId={groupId} />}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="group-members-overview">
                        <div className="members-header">Members</div>
                        <div className="group-member-avatars">
                            <img src={group.creator.profile_picture} alt="" className="member-avatar" />
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
                            <span className="member-name">{group.creator.name}</span>
                            {group.members?.map(member => (
                            <span key={member.id} className="member-name">{member.member.name}</span>)
                            )}
                        </div>
                    </div>
                </div>
            </div>
            </div>

            <div className="payments-feed">
                <div className="feed-header">
                    <h3>Payments Feed</h3>
                   <div className="open-add-expense-button-div">
                   <OpenModalButton
                        modalComponent={<AddExpenseFormModal groupId={group.id} />}
                        buttonText={'Add an expense'}
                    />
                   </div>
                </div>
                {group.expenses.length > 0 ? (
                    group.expenses
                        .sort(sortByDateDescending)
                        .map(expense => (
                            <div key={expense.id} className="payment-item">
                                <div className="payment-item-top">
                                    <div className="payment-description">{expense.description}</div>
                                <div className="payment-paid-by"> Paid By:
                                <span className="payment-payer-name"> {expense.payer}</span>
                                </div>
                                </div>
                                <div className="payment-item-bottom">Total: ${expense.amount}
                                {expense.payments.map(payment => (
                                    payment.status === 'paid' && (
                                        <div className="someone-made-payment" key={payment.id}>
                                            {payment.payee} paid {payment.payer} ${payment.amount.toFixed(2)}
                                        </div>
                                    )
                                ))}
                                </div>
                            </div>
                        ))
                ) : (
                    <p>No payments made yet.</p>
                )}
            </div>
            </>
    );
};

export default GroupDetails;
