import { Chip, CircularProgress } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import Link from "@material-ui/core/Link";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import SortIcon from "@material-ui/icons/Sort";
import React from "react";
import { connect } from "react-redux";
import { database } from "../../firebase/firebase.utils";
import { getPosts, sortPosts } from "../../middleware";
import { POST_CATEGORIES } from "../../shared/constants";
import ErrorMessage from "../../shared/ErrorMessage";
import Post from "../Post";
import postData from "./postsdata.json";
import "./style.css";

let posts = [];

class HomePage extends React.Component {
  state = {
    items: postData.slice(0, 5),
    hasMore: true,
    index: 5,
    filterClicked: null,
    filterValue: "",
    allPosts: [],
    postsArrived: false,
    error: null,
    userDspaces: [],
    userDspacesArrived: false,
    userInfo: null,
    userInfoReceived: false,
  };

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    let data = await getPosts();
    if (data.error) {
      console.log(data.error);
      this.setState({ error: data.error });
    } else {
      this.setState({ postsArrived: true, posts: data.posts });
    }
    // posts = await sortPosts();
  }

  componentWillUnmount() {
    this.setState({ allPosts: null });
    posts = [];
  }

  removePost = (post) => {
    let arr = this.state.allPosts;
    let index = arr.indexOf(post);
    arr.splice(index, 1);
    this.setState({ allPosts: arr });
    database.collection("posts").doc(post.id).delete();
  };

  handleFilterClick = (event) => {
    this.setState({ filterClicked: event.currentTarget });
  };

  handleFilterClose = (value) => {
    this.setState({ filterClicked: null, filterValue: value });
  };

  filterPosts = (posts) => {
    let filteredPosts = posts.filter(
      (x) => x.category === this.state.filterValue
    );
    if (filteredPosts.length < 1) {
      filteredPosts = posts;
    }
    return filteredPosts.map((post) => (
      <Post
        post={post}
        key={post.id}
        userLiked={this.props.user.likedPosts.includes(post.id)}
        postedByUser={this.props.user.rollNumber == post.authorRollNumber}
        removePost={this.removePost}
        inIndividualPost={false}
      />
    ));
  };

  checkLikedStatus(posts) {
    posts.forEach((post, index) => {
      if (this.props.user.likedPosts && this.props.user.likedPosts.length > 0) {
        posts[index].userLiked = this.props.user.likedPosts.includes(post.id);
      } else {
        posts[index].userLiked = false;
      }
    });
    return posts;
  }

  handleChipDelete(tag, event) {
    this.setState({ filterClicked: null, filterValue: "" });
  }

  render() {
    if (this.state.error) {
      return <ErrorMessage error={this.state.error} />;
    } else if (this.props.user && this.state.postsArrived) {
      let posts = this.checkLikedStatus(this.state.posts);
      posts = sortPosts(posts, this.props.user);
      return (
        <div>
          <Box
            display="flex"
            flexDirection="row-reverse"
            align-items="center"
            p={1}
            m={1}
          >
            <Box p={1}>
              <Button
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={this.handleFilterClick}
              >
                <SortIcon />
                Filter
              </Button>
            </Box>

            {this.state.filterValue && (
              <Chip
                style={{ marginTop: "15px" }}
                variant="outlined"
                color="primary"
                label={this.state.filterValue}
                onDelete={(event) =>
                  this.handleChipDelete(this.state.filterValue, event)
                }
                size="small"
                className="tag"
              />
            )}
          </Box>
          <Menu
            id="simple-menu"
            anchorEl={this.state.filterClicked}
            keepMounted
            open={Boolean(this.state.filterClicked)}
            onClose={() => this.handleFilterClose("")}
          >
            {Object.keys(POST_CATEGORIES).map(function (key) {
              return (
                <MenuItem
                  key={key}
                  onClick={() => this.handleFilterClose(POST_CATEGORIES[key])}
                >
                  {POST_CATEGORIES[key]}
                </MenuItem>
              );
            }, this)}
          </Menu>
          <Link href="/new-post" variant="body2">
            <Tooltip title="New Post" aria-label="add">
              <Fab color="primary" aria-label="add" className="fab-icon">
                <AddIcon className="add-icon" />
              </Fab>
            </Tooltip>
          </Link>
          {this.filterPosts(posts)}
        </div>
      );
    } else {
      return (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <CircularProgress size={80} />
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => ({
  user: state.user.user,
});

export default connect(mapStateToProps)(HomePage);
