import { combineReducers } from 'redux';
import isNewUserReducer from './signup/isNewUser-reducer';
import userReducer from './user/user-reducer'; 
import dspaceSearchReducer from './dSpaceSearch/searchBar-reducer'; 
import commentsReducer from './comments/comments-reducer';
import postsReducer from './posts/posts-reducer';

export default combineReducers ({
    isNewUser: isNewUserReducer,
    user: userReducer, 
    dSpaceSearch: dspaceSearchReducer,
    comments: commentsReducer,
    posts: postsReducer,
});