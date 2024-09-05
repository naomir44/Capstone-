const ADD_NOTIFICATION = 'notifications/addNotification';
const MARK_NOTIFICATIONS_AS_READ = 'notifications/markNotificationsAsRead';
const CLEAR_NOTIFICATIONS = 'notifications/clearNotifications';

export const addNotification = (notification) => {
  console.log('Dispatching addNotification:', notification);
  return {
    type: ADD_NOTIFICATION,
    payload: notification,
  };
};

export const markNotificationsAsRead = (friendEmail) => ({
  type: MARK_NOTIFICATIONS_AS_READ,
  payload: friendEmail,
});

export const clearNotifications = () => ({
  type: CLEAR_NOTIFICATIONS,
});

export const markNotificationsAsReadThunk = (friendEmail) => async (dispatch) => {
  const response = await fetch(`/api/messages/notifications/mark-all-read`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ friendEmail }),
  });

  if (response.ok) {
    dispatch(markNotificationsAsRead(friendEmail));
  } else {
    console.error('Failed to mark notifications as read');
  }
};

const initialState = {
  notifications: [],
  unreadCount: 0,
};

export default function notificationReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_NOTIFICATION: {
      const newNotification = action.payload;
      console.log('Adding notification to state:', newNotification);
      return {
        ...state,
        notifications: [...state.notifications, newNotification],
        unreadCount: state.unreadCount + 1,
      };
    }

    case MARK_NOTIFICATIONS_AS_READ: {
      const friendEmail = action.payload;

      const updatedNotifications = state.notifications.map(notification =>
        notification.notification_from === friendEmail
          ? { ...notification, is_read: true }
          : notification
      );

      const unreadCount = updatedNotifications.reduce(
        (count, notification) => (notification.is_read ? count : count + 1),
        0
      );

      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount,
      };
    }

    case CLEAR_NOTIFICATIONS: {
      return {
        ...state,
        notifications: [],
        unreadCount: 0,
      };
    }

    default:
      return state;
  }
}
