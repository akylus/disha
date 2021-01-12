import { database } from "./firebase/firebase.utils";
import {
  COLLECTION,
  POST_CATEGORIES,
  POST_SCORES,
  POST_SCORE_THRESHOLD,
} from "./shared/constants";

export const fetchUsers = async () => {
  let error = null;
  let allUsers = await database
    .collection(COLLECTION.USERS)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        error = {}
        error.message = "Error fetching users!";
        error.code = "<ERROR>"
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
      error = err;
      return [];
    });
  return { users: allUsers, error: error };
};

export const getCurrentUser = async () => {
  let error = null;
  let currentUserId = localStorage.getItem("currentUserId");
  let userData = await database
    .collection(COLLECTION.USERS)
    .doc(currentUserId)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        error = {}
        error.message = "Error fetching user!";
        error.code = "<ERROR>"
        console.log("Error fetching user!");
      } else {
        let data = doc.data();
        if (data.password) data.password = "[hidden]";
        data.id = doc.id;
        return data;
      }
    })
    .catch((err) => {
      console.log("Error fetching user!", err);
      error = err;
    });
  return { userData: userData, error: error };
};

export const getPosts = async () => {
  let error = null;
  let posts = await database
    .collection(COLLECTION.POSTS)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        error = {}
        error.message = "No posts available";
        error.code = "<ERROR>"
        console.log("No posts available");
        return;
      }
      let posts = [];
      snapshot.forEach((doc) => {
        var a = doc.data();
        a.id = doc.id;
        a.score = 0;
        posts.push(a);
      });
      return posts;
    })
    .catch((err) => {
      console.log("Error getting documents", err);
      error = err;
    });
  return { posts: posts, error: error };
};

export const sortPosts = (posts, currentUser) => {
  let importantPosts = [];
  let unimportantPosts = [];
  posts.forEach((post) => {
    post.score = calculatePostScore(post, currentUser);
    if (post.score > POST_SCORE_THRESHOLD) {
      importantPosts.push(post);
    } else {
      unimportantPosts.push(post);
    }
  });
  importantPosts.sort((a, b) => (a.timeStamp > b.timeStamp ? -1 : 1));
  unimportantPosts.sort((a, b) => (a.timeStamp > b.timeStamp ? -1 : 1));
  posts = importantPosts.concat(unimportantPosts);
  posts.forEach((post, index) => {
    post.score = 0;
    posts[index] = post;
  });
  return posts;
};

const calculatePostScore = (post, currentUser) => {
  let score = 0;
  if (post.isAdminPost) {
    score += POST_SCORES.ADMIN;
  }
  if (
    post.category === POST_CATEGORIES.PROJECT ||
    post.category === POST_CATEGORIES.INTERNSHIP
  ) {
    score += POST_SCORES.INTERNSHIP_PROJECT;
  }
  if (!post.userLiked) {
    score += POST_SCORES.NOT_LIKED;
  }
  if (
    post.authorRollNumber.substring(0, 2) ===
      currentUser.rollNumber.substring(0, 2) ||
    post.authorRollNumber.substring(6, 8) ===
      currentUser.rollNumber.substring(6, 8)
  ) {
    score += POST_SCORES.YEAR_BRANCH;
  }
  post.dSpaces.forEach((dspace) => {
    if (currentUser.dspaces.includes(dspace)) {
      score += POST_SCORES.SUBSCRIBED_DSPACE;
    }
  });
  return score;
};
