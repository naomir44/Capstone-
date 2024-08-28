const GET_MESSAGES = 'messages/getMessages';
const ADD_MESSAGE = 'messages/addMessage';


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


export const fetchMessages = (sender, recipient) => async (dispatch) => {
  const response = await fetch(`/api/messages/private?sender=${sender}&recipient=${recipient}`);

  if (response.ok) {
    const data = await response.json();
    console.log(data)
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
          content: message.content  // Send only the necessary data
      })
  });

  if (response.ok) {
      const newMessage = await response.json();
      dispatch(addMessage(newMessage));  // Use the server's response, which includes the correct timestamp
  } else {
      console.error('Failed to send message');
  }
};



const initialState = {
  list: []
};


const messagesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_MESSAGES:
      return {
        ...state,
        list: action.messages
      };
    case ADD_MESSAGE:
      return {
        ...state,
        list: [...state.list, action.message]
      };
    default:
      return state;
  }
};

export default messagesReducer;
export { addMessage };
