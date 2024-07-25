const GET_GROUPS = 'groups/getGroups';
const GET_GROUP_DEETS = 'groups/getGroupDeets';

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
  console.log(response)

  if (response.ok) {
    const group = await response.json()
    console.log(group)
    dispatch(getGroupDeets(group))
    return group
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
  default:
    return state
  }
}

export default groupsReducer;
