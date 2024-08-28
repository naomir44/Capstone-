import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, addMessage } from '../../redux/message';
import { io } from 'socket.io-client';
import './Chat.css';

function Chat() {
    const [socket, setSocket] = useState(null);
    const [recipientEmail, setRecipientEmail] = useState('');
    const [message, setMessage] = useState('');
    const userEmail = useSelector(state => state.session.user.email);
    const friendsList = useSelector(state => state.friends.list);
    const dispatch = useDispatch();
    const messages = useSelector(state => state.messages.list);

useEffect(() => {
  const socketInstance = io('http://localhost:5000');
  setSocket(socketInstance);

  socketInstance.on('receive_private_message', (data) => {
      // if (data.sender_email !== userEmail) {
          dispatch(addMessage(data));
      // }
  });

  return () => {
      if (socketInstance) {
          socketInstance.off('receive_private_message');
      }
  };
}, [dispatch, userEmail]);

    const selectFriend = (friendEmail) => {
        setRecipientEmail(friendEmail);
        dispatch(fetchMessages(userEmail, friendEmail));
        socket.emit('join_private', { user_email: userEmail, recipient_email: friendEmail });
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
}

export default Chat;
