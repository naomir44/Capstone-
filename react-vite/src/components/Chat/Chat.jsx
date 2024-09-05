import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, addMessage } from '../../redux/message';
import { markNotificationsAsReadThunk } from '../../redux/notification';
import { io } from 'socket.io-client';
import axios from 'axios';
import './Chat.css';

const Chat = () => {
    const [socket, setSocket] = useState(null);
    const [recipientEmail, setRecipientEmail] = useState('');
    const [message, setMessage] = useState('');
    const userEmail = useSelector(state => state.session.user.email);
    const friendsList = useSelector(state => state.friends.list);
    const messages = useSelector(state => state.messages.list);
    const dispatch = useDispatch();
    const notifications = useSelector(state => state.notifications.notifications)
    console.log(notifications)

    useEffect(() => {
        const socketInstance = io('https://fair-share-3ygy.onrender.com');
        // const socketInstance = io('http://127.0.0.1:5000');
        setSocket(socketInstance);

        socketInstance.on('connect', () => {
            console.log('WebSocket connected:', socketInstance.id);
        });

        if (userEmail) {
            console.log(`Joining notification room: notification_${userEmail}`);
            socketInstance.emit('join', { room: userEmail });
        }

        socketInstance.on('receive_private_message', (data) => {
            dispatch(addMessage(data));
        });

        socketInstance.on('mark_notification_as_read', (data) => {
            console.log('Notification marked as read:', data);
        });

        return () => {
            if (socketInstance) {
                socketInstance.off('receive_private_message');
                socketInstance.off('new_notification');
                socketInstance.off('mark_notification_as_read');
                socketInstance.emit('leave', { room: `notification_${userEmail}` });
                socketInstance.disconnect();
            }
        };
    }, [dispatch, userEmail]);

    const selectFriend = (friendEmail) => {
        setRecipientEmail(friendEmail);
        dispatch(fetchMessages(userEmail, friendEmail));
        handleNotificationsViewed(friendEmail);

        if (socket) {
            socket.emit('join_private', { user_email: userEmail, recipient_email: friendEmail });
        }
    };

    const handleNotificationsViewed = (friendEmail) => {
        axios.post('/api/messages/notifications/mark-all-read', { friendEmail })
            .then((response) => {
                console.log('Notifications marked as read:', response.data);
                dispatch(markNotificationsAsReadThunk(friendEmail));

                if (socket) {
                    socket.emit('mark_notification_as_read', { friend_email: friendEmail });
                }
            })
            .catch((error) => {
                console.error('Error marking notifications as read:', error);
            });
    };

    const showNotificationInFriendsList = (friendEmail) => {
        return notifications.some(notification => notification.notification_from === friendEmail && !notification.is_read);
    };

    const sendPrivateMessage = () => {
        if (recipientEmail && message) {
            if (socket) {
                const timestamp = new Date().toISOString();
                const messageData = {
                    user_email: userEmail,
                    recipient_email: recipientEmail,
                    content: message,
                    timestamp
                };

                socket.emit('send_private_message', messageData);

                const notificationData = {
                    recipient_email: recipientEmail,
                    message: `New message from ${userEmail}`,
                    link: `/chat/${userEmail}/${recipientEmail}`,
                    notification_from: userEmail
                };
                socket.emit('send_notification', notificationData);
                setMessage('');
            }
        } else {
            alert("Please select a friend and type a message.");
        }
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return 'Invalid Date';
        return date.toLocaleString();
    };

    return (
        <div className="chat-container">
            <div className="friends-list-chat">
    {friendsList.map((friend) => (
        <div
            key={friend.email}
            className={`friend-item-chat ${friend.email === recipientEmail ? 'active' : ''}`}
            onClick={() => selectFriend(friend.email)}
        >
            <img src={friend.profile_picture} alt={friend.name} />
            <span>{friend.name}</span>
            {showNotificationInFriendsList(friend.email) && (
                <span className="new-message-indicator">New Message</span>
            )}
        </div>
    ))}
</div>
            <div className="chat-content">
                {recipientEmail && (
                    <>
                        <div id="messages" className="message-list">
                            {messages.map((msg, index) => (
                                <div key={index} className="message-item">
                                    <div className="message-sender">{msg.sender_name}</div>
                                    <div>{msg.content}</div>
                                    <div className="message-timestamp">{formatTimestamp(msg.timestamp)}</div>
                                </div>
                            ))}
                        </div>
                        <div className="message-input-container">
                            <input
                                type="text"
                                placeholder="Type a message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        sendPrivateMessage();
                                    }
                                }}
                                className="chat-input"
                            />
                            <button onClick={sendPrivateMessage} className="chat-button">
                                Send
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Chat;
