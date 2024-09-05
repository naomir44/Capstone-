const GET_MESSAGES = 'messages/getMessages';
const ADD_MESSAGE = 'messages/addMessage';
const MARK_MESSAGES_READ = 'messages/markMessagesRead';

const getMessages = messages => {
  return {
    type: GET_MESSAGES,
    messages
  }
};

const addMessage = message => {
  return {
    type: ADD_MESSAGE,
    message
  }
};

const markMessagesRead = notification_from => {
  return {
    type: MARK_MESSAGES_READ,
    notification_from
  }
};


export const fetchMessages = (sender, recipient) => async (dispatch) => {
  const response = await fetch(`/api/messages/private?sender=${sender}&recipient=${recipient}`);

  if (response.ok) {
    const data = await response.json();
    dispatch(getMessages(data.messages));
  } else {
    console.error('Failed to fetch messages');
  }
};

export const sendMessageThunk = (message) => async (dispatch) => {
  const response = await fetch('/api/messages/send', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          user_email: message.user_email,
          recipient_email: message.recipient_email,
          content: message.content
      })
  });

  if (response.ok) {
      const newMessage = await response.json();
      dispatch(addMessage(newMessage));
  } else {
      console.error('Failed to send message');
  }
};

export const markMessagesAsRead = (notification_from) => (dispatch) => {
  dispatch(markMessagesRead(notification_from));
};


const initialState = {
  list: [],
  unreadMessages: {},
};

const messagesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_MESSAGES: {
      return {
        ...state,
        list: action.messages,
      };
    }
    case ADD_MESSAGE: {
      const recipientEmail = action.message.recipient_email;

      return {
        ...state,
        list: [...state.list, action.message],
        unreadMessages: {
          ...state.unreadMessages,
          [recipientEmail]: (state.unreadMessages[recipientEmail] || 0) + 1
        }
      };
    }
    case MARK_MESSAGES_READ: {
      return {
        ...state,
        unreadMessages: {
          ...state.unreadMessages,
          [action.notification_from]: 0
        }
      };
    }
    default:
      return state;
  }
};

export default messagesReducer;
export { addMessage };
