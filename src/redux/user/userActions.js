import {
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
} from "./userTypes";
import { database } from "../../firebase/firebase.utils";
import { COLLECTION } from "../../shared/constants";

export const fetchUsersRequest = () => {
  return {
    type: FETCH_USERS_REQUEST,
  };
};

export const fetchUsersSuccess = (users) => {
  return {
    type: FETCH_USERS_SUCCESS,
    payload: users,
  };
};

export const fetchUsersFailure = (error) => {
  return {
    type: FETCH_USERS_FAILURE,
    payload: error,
  };
};

export const fetchUsers = () => {
  return (dispatch) => {
      debugger;
      console.log("user req")
    dispatch(fetchUsersRequest);
    database
      .collection(COLLECTION.USERS)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          console.log("No matching documents.");
          dispatch(fetchUsersSuccess([]));
          return;
        }
        let users = [];
        snapshot.forEach((doc) => {
          let userData = doc.data();
          userData.id = doc.id;
          users.push(userData);
        });
        dispatch(fetchUsersSuccess(users));
      })
      .catch((err) => {
        dispatch(fetchUsersFailure(err.message));
        console.log("Error getting documents", err);
      });
  };
};


//old
export const setUser = user => ({
    type: 'SET_USER',
    payload: user
})