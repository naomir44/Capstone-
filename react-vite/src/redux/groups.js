const GET_GROUPS = 'groups/getGroups';
const GET_GROUP_DEETS = 'groups/getGroupDeets';
const CREATE_GROUP = 'groups/createGroup';
const UPDATE_GROUP = 'groups/updateGroup';
const DELETE_GROUP = 'groups/deleteGroup';

const getGroups = groups => {
  return {
    type: GET_GROUPS,
    groups
  }
}

const getGroupDeets = group => {
  return {
    type: GET_GROUP_DEETS,
    group
  }
}

const createGroup = group => {
  return {
    type: CREATE_GROUP,
    group
  }
}

const updateGroup = group => {
  return {
    type: UPDATE_GROUP,
    group
  }
}

const deleteGroup = groupId => {
  return {
    type: DELETE_GROUP,
    groupId
  }
}

export const fetchGetGroups = () => async (dispatch) => {
  const response = await fetch('/api/groups/');

  if (response.ok) {
    const data = await response.json();
    dispatch(getGroups(data));
    return data;
  }
}

export const fetchGroupDeets = (groupId) => async (dispatch) => {
  const response = await fetch(`/api/groups/${groupId}/`);

  if (response.ok) {
    const group = await response.json()
    dispatch(getGroupDeets(group))
    return group
  }
}

export const createGroupThunk = (groupData) => async (dispatch) => {
  const response = await fetch('/api/groups/new/', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(groupData),
  });

  if (response.ok) {
      const newGroup = await response.json();
      dispatch(createGroup(newGroup));
      return newGroup;
  } else {
      const error = await response.json();
      console.error('Failed to create group:', error);
  }
};

export const updateGroupThunk = (groupId, groupData) => async (dispatch) => {
  const response = await fetch(`/api/groups/${groupId}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(groupData),
  });

  if (response.ok) {
    const updatedGroup = await response.json();
    dispatch(updateGroup(updatedGroup));
    return updatedGroup;
  } else {
    const error = await response.json();
    console.error('Failed to update group:', error);
  }
}

export const deleteGroupThunk = (groupId) => async (dispatch) => {
  const response = await fetch(`/api/groups/${groupId}/`, {
    method: 'DELETE',
  });
  if (response.ok) {
    dispatch(deleteGroup(groupId))
    return {success: true }
  } else {
    const error = await response.json()
    console.error('Failed to delete group:', error);
    return { success: false, error }
  }
}

const initialState = {};

function groupsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_GROUPS: {
      const newState = { ...state }
      action.groups.forEach(group => (newState[group.id] = group))
      return newState
  }
  case GET_GROUP_DEETS: {
    return {
      ...state,
      [action.group.id]: action.group
    }
  }
  case CREATE_GROUP: {
    const newState = { ...state }
    const group = action.group
    newState[group.id] = group
    return newState
  }
  case UPDATE_GROUP: {
    const newState = { ...state }
    const group = action.group
    newState[group.id] = group
    return newState;
  }
  case DELETE_GROUP: {
    const newState = { ...state }
    delete newState[action.groupId]
    return newState
  }
  default:
    return state
  }
}

export default groupsReducer;
