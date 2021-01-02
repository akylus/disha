import { database } from "./firebase/firebase.utils";
import { COLLECTION } from "./shared/constants";

export const fetchUsers = async () => {
    let error = {};
  let allUsers = await database
    .collection(COLLECTION.USERS)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        console.log("No matching documents.");
        return;
      }
      let users = [];
      snapshot.forEach((doc) => {
        let userData = doc.data();
        userData.id = doc.id;
        users.push(userData);
      });
      return users;
    })
    .catch((err) => {
      console.log("Error getting documents", err);
      let error = err;
      return [];
    });
    return {users: allUsers, error: error}
};
