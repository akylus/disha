import {
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
  SET_USER,
} from "./userTypes";

const INITIAL_STATE = {
  users: [],
  usersLoading: true,
  usersError: "",
  user: null,
  userError: "",
  userLoading: true,
}; // similar to first state value set

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_USERS_REQUEST:
      return {
        ...state,
        usersLoading: true,
      };
    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        usersLoading: false,
        users: action.payload,
      };
    case FETCH_USERS_FAILURE:
      return {
        ...state,
        usersLoading: false,
        users: [],
        usersError: action.payload,
      };
    case SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
