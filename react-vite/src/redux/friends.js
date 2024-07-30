const GET_FRIENDS = 'friends/getFriends';
const ADD_FRIEND = 'friends/addFriend';
const GET_FRIEND_REQUESTS = 'friends/getFriendRequests';
const ACCEPT_FRIEND = 'friends/acceptFriend';
const RECEIVE_FRIEND_REQUEST = 'friends/receiveFriendRequest';
const DELETE_FRIEND = 'friends/deleteFriend';

const getFriends = friends => {
  return {
    type: GET_FRIENDS,
    friends
  }
}

const addFriend = friend => {
  return {
    type: ADD_FRIEND,
    friend
  }
}

const getFriendRequests = requests => {
  return {
    type: GET_FRIEND_REQUESTS,
    requests
  };
};

const acceptFriend = friend => {
  return {
      type: ACCEPT_FRIEND,
      friend
  };
};

const receiveFriendRequest = friendRequest => ({
  type: RECEIVE_FRIEND_REQUEST,
  friendRequest
});

const deleteFriend = friendId => ({
  type: DELETE_FRIEND,
  friendId
});

export const fetchFriends = () => async (dispatch) => {
  const response = await fetch('/api/friendships/all/')

  if (response.ok) {
    const friends = await response.json()
    console.log(friends)
    dispatch(getFriends(friends))
    return friends
  } else {
    console.error('Failed to fetch friends')
  }
}

export const addFriendThunk = (email) => async (dispatch) => {
  const response = await fetch('/api/friendships/add/', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email })
  })

  if (response.ok) {
    const data = await response.json()
    dispatch(addFriend(data))
    dispatch(receiveFriendRequest(data))
    return data;
  } else {
    const error = await response.json()
    console.error('Failed to add friend:', error)
  }
}

export const fetchFriendRequests = (userId) => async (dispatch) => {
  const response = await fetch(`/api/friendships/requests/`);

  if (response.ok) {
      const requests = await response.json();
      const userRequests = requests.filter(request => request.friend_id === userId);
      dispatch(getFriendRequests(userRequests));
      return userRequests;
  } else {
      console.error('Failed to fetch friend requests');
  }
};

export const acceptFriendThunk = (friend_id) => async (dispatch) => {
  const response = await fetch(`/api/friendships/accept/${friend_id}/`, {
      method: 'POST'
  });

  if (response.ok) {
      const data = await response.json();
      console.log(data)
      dispatch(acceptFriend(data));
      dispatch(fetchFriends());
      return data;
  } else {
      const error = await response.json();
      console.error('Failed to accept friend:', error);
  }
};

export const deleteFriendThunk = (friendId) => async (dispatch) => {
  const response = await fetch(`/api/friendships/delete/${friendId}/`, {
      method: 'DELETE'
  });

  if (response.ok) {
      dispatch(deleteFriend(friendId));
      dispatch(fetchFriends());
  } else {
      const error = await response.json();
      console.error('Failed to delete friend:', error);
  }
};

const initialState = {
  list: [],
  requests: []
}
const friendsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_FRIENDS:
      return {
        ...state,
        list: action.friends
      }
      case ADD_FRIEND:
        return {
          ...state,
          list: [...state.list, action.friend]
        }
        case GET_FRIEND_REQUESTS:
          return {
            ...state,
            requests: action.requests
          }
          case RECEIVE_FRIEND_REQUEST:
            return {
                ...state,
                requests: [...state.requests, action.friendRequest]
            };
          case ACCEPT_FRIEND: {
            const newState = {
              ...state,
              list: [...state.list, action.friend],
              requests: state.requests.filter(req => req.id !== action.friend.id)
            }
            return newState
          }
          case DELETE_FRIEND: {
            const newState = {
              ...state,
              list: state.list.filter(friend => friend.id !== action.friendId)
            }
            return newState
          }
      default:
        return state
  }
}

export default friendsReducer;
