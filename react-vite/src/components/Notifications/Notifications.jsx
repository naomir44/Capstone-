import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import './Notifications.css'

const Notifications = () => {
  const unreadCount = useSelector(state => state.notifications.unreadCount);
  const userEmail = useSelector(state => state.session.user.email);

  useEffect(() => {
    const socket = io('https://fair-share-3ygy.onrender.com');

    if (userEmail) {
      socket.emit('join', { room: userEmail });

      // return () => {
      //   socket.disconnect();
      // };
    }
  }, [userEmail]);

  return (
    unreadCount > 0 ? <span className="unread-badge">{unreadCount}</span> : null
  );
};

export default Notifications;
