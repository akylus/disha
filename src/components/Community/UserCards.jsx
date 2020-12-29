import React, { Component, Fragment, useEffect } from "react";
import DspaceCard from "../SearchPage/DspaceCard";
import { Container, CircularProgress, Typography } from "@material-ui/core";
import { Row, Col } from "react-bootstrap";
import "../SearchPage/styles.css";
import { Link } from "react-router-dom";
import UserCard from "./UserCard";
import { FILTER_TYPES } from "../../shared/constants";
import { connect } from "react-redux";
import { fetchUsers } from "../../redux";

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
        return userFullName.toLowerCase().includes(searchValue.toLowerCase());
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
        isSameBatch = isUserFromSameBatch(user, currentUserInfo);
        break;
      case FILTER_TYPES.DEPARTMENT:
        isSameDepartment = isUserFromSameDepartment(user, currentUserInfo);
        break;
      case FILTER_TYPES.SECTION:
        isSameClass = isUserFromSameClass(user, currentUserInfo);
        break;
    }
  });
  return isSameBatch || isSameDepartment || isSameClass;
};

const isUserFromSameBatch = (user, currentUserInfo) => {
  return currentUserInfo.year === user.year;
};
const isUserFromSameDepartment = (user, currentUserInfo) => {
  return currentUserInfo.department === user.department;
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
    };
  }

  componentDidMount() {
    this.props.fetchUsers();
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
    debugger;
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
    console.log("USERSDATA", this.props.usersData);
    users = this.props.usersData.users;
    return this.props.usersData.usersLoading ? (
      <Container>
        <Row>
          <Col md={{ span: 6, offset: 3 }}>
            <CircularProgress color="secondary" />
          </Col>
        </Row>
      </Container>
    ) : this.props.usersData.usersError ? (
      <Container>
        <Row>
          <Col md={{ span: 6, offset: 3 }}>
            <Typography variant="h4">Error!</Typography>
            <Typography variant="h6">
              {this.props.usersData.usersError}
            </Typography>
          </Col>
        </Row>
      </Container>
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
                    // description = { dSpace.description }
                    key={user.firstName}
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
                  if you have your friends contact, ask him to register on DISHA
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
    usersData: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUsers: () => dispatch(fetchUsers()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserCards);
