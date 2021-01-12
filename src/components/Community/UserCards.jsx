import { CircularProgress, Container, Typography } from "@material-ui/core";
import React, { Component, Fragment } from "react";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { fetchUsers } from "../../middleware";
import { FILTER_TYPES } from "../../shared/constants";
import "../SearchPage/styles.css";
import UserCard from "./UserCard";
import { connect } from "react-redux";
import ErrorMessage from "../../shared/ErrorMessage"
let users = [];

let searchUsers = [];

let filteredUsers = [];

let completeUsersArray = [];

const updateUsersArray = (searchValue, filterValues) => {
  if (!searchValue) {
    if (filteredUsers) return filteredUsers;
    else return completeUsersArray;
  } else {
    if (filterValues.length)
      return filteredUsers.filter((user) => {
        let userFullName = user.firstName + user.lastName;
        let a = userFullName.toLowerCase().includes(searchValue.toLowerCase());
      });
    else
      return completeUsersArray.filter((user) => {
        let userFullName = user.firstName + user.lastName;
        return userFullName.toLowerCase().includes(searchValue.toLowerCase());
      });
  }
};

const filterUsers = (searchValue, filterValues) => {
  let currentUserInfo = JSON.parse(localStorage.getItem("currentUserInfo"));
  if (!filterValues.length) {
    if (searchUsers) return searchUsers;
    else return completeUsersArray;
  } else {
    if (searchValue)
      return searchUsers.filter((user) => {
        return checkUserValid(user, currentUserInfo, filterValues);
      });
    else
      return completeUsersArray.filter((user) => {
        return checkUserValid(user, currentUserInfo, filterValues);
      });
  }
};

const checkUserValid = (user, currentUserInfo, filterValues) => {
  let isSameBatch = false;
  let isSameDepartment = false;
  let isSameClass = false;
  filterValues.forEach((value) => {
    switch (value) {
      case FILTER_TYPES.BATCH:
        isSameBatch = currentUserInfo.year === user.year;
        break;
      case FILTER_TYPES.DEPARTMENT:
        isSameDepartment = currentUserInfo.department === user.department;
        break;
      case FILTER_TYPES.SECTION:
        isSameClass = isUserFromSameClass(user, currentUserInfo);
        break;
    }
  });
  return isSameBatch || isSameDepartment || isSameClass;
};

const isUserFromSameClass = (user, currentUserInfo) => {
  return (
    currentUserInfo.year === user.year &&
    currentUserInfo.department === user.department &&
    currentUserInfo.section === user.section
  );
};
export class UserCards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUserPresent: true,
      usersLoaded: false,
      error: "",
    };
  }

  async componentDidMount() {
    let data;
    if (users.length < 1) {
      data = await fetchUsers();
      if (data.users) {
        completeUsersArray = data.users;
        users = data.users;
        this.setState({ usersLoaded: true, isUserPresent: true });
      } else {
        this.setState({
          usersLoaded: true,
          isUserPresent: false,
          error: data.error,
        });
      }
    }
  }

  componentWillUnmount() {
    users = [];
    searchUsers = [];
  }

  componentDidUpdate(prevProps) {
    this.updateUsers(prevProps);
  }

  updateUsers(prevProps) {
    if (prevProps.searchValue !== this.props.searchValue) {
      users = updateUsersArray(this.props.searchValue, this.props.filterValues);
      searchUsers = users;
      if (users.length === 0) {
        this.noUsersFound();
      } else {
        this.UserFound();
      }
    }
    if (prevProps.filterValues !== this.props.filterValues) {
      users = filterUsers(this.props.searchValue, this.props.filterValues);
      filteredUsers = users;
      if (users.length === 0) {
        this.noUsersFound();
      } else {
        this.UserFound();
      }
    }
    if (this.props.searchValue === "" && this.props.filterValues.length < 1) {
      users = completeUsersArray;
    }
  }

  noUsersFound() {
    this.setState({
      isUserPresent: false,
    });
  }

  UserFound() {
    this.setState({
      isUserPresent: true,
    });
  }

  render() {
    return !this.state.usersLoaded ? (
      <Container>
        <Row>
          <Col md={{ span: 6, offset: 3 }}>
            <CircularProgress color="secondary" />
          </Col>
        </Row>
      </Container>
    ) : this.state.error ? (
      <ErrorMessage error={this.state.error}/>
    ) : (
      <Container>
        <Row className="d-space-cards-display-row">
          {users.length > 0 ? (
            users.map((user) => {
              let linkPath = `/id=${user.rollNumber}`;
              return (
                <Link to={linkPath}>
                  <UserCard
                    className="d-space-card"
                    title={user.firstName + " " + user.lastName}
                    isAlumni={user.isAlumni}
                    department={user.department}
                    // description = { dSpace.description }
                    key={user.id}
                  />
                </Link>
              );
            })
          ) : (
            <Fragment>
              <center>
                <Typography variant="h4">Oof, user not found!</Typography>
              </center>
              <br />
              <center>
                <Typography variant="h6">
                  if you have your friends who are missing here, ask them to
                  register on DISHA!
                </Typography>
              </center>
            </Fragment>
          )}
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userData: state.user,
  };
};

export default connect(mapStateToProps)(UserCards);
