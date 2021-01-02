import { CircularProgress, Divider, Grid, Typography } from "@material-ui/core";
import Fab from '@material-ui/core/Fab';
import Link from '@material-ui/core/Link';
import Tooltip from '@material-ui/core/Tooltip';
import EditIcon from '@material-ui/icons/Edit';
import 'firebase/auth';
import 'firebase/firestore';
import React, { Component } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { connect } from 'react-redux';
import { database } from '../../firebase/firebase.utils';
import ProfileImage from "./ProfileImage";
import UserCommunity from "./UserCommunity";
import UserInfo from "./UserInfo";
import UserPosts from "./UserPosts";

export class Profile extends Component {

  

  constructor(props) { 
    super(props); 
    this.state = {
      info: null
    }
    let currentUserId = localStorage.getItem('currentUserId')
    let userData = database.collection('users').doc(currentUserId);
    this.getUserData(userData);
  }

  getUserData(userData) {
    var a;
    a = userData.get()
      .then(doc => {
        if (!doc.exists) {
          // console.log('No such document!');
        } else {
          this.setState({ info: doc.data() })
          //console.log('Document data:', doc.data());
        }
      })
      .catch(err => {
        // console.log('Error getting document', err);
      });
  }

  initials() { 
    // console.log("State from profile",this.state);
    return this.state.info.firstName[0].toUpperCase() + this.state.info.lastName[0].toUpperCase()
  }



  render() {
    return (
      this.state.info ?
        <Grid item xs={12}>
          <Container className="user-profile-container">
            <Row className="user-profile-header-row">
              <Grid container spacing={2}>
                <Grid item xs={12} md={1}><ProfileImage name={this.initials()} scale={100} variant="square" /></Grid>
                <Grid item xs={12} md={11} style={{ margin: '1px' }}  >
                  <Typography variant="h2" classes={{ root: 'user-name-title-style' }} >{this.state.info.firstName + " " + this.state.info.lastName}</Typography>
                </Grid>
              </Grid>
            </Row>
            <Row>
              <Grid item xs={12}><UserInfo userInfo={this.state.info} /></Grid>
            </Row>
            <Divider></Divider>
            <Row>
              <Col><UserPosts currentUserRollNumber={this.state.info.rollNumber} userRollNumber={this.state.info.rollNumber} userLikedPosts={this.state.info.likedPosts} /></Col>
              <Col><UserCommunity userInfo={this.state.info} /></Col>
            </Row>
          </Container>
          <Link href="/reauth" variant="body2">
            <Tooltip title="Edit Profile" aria-label="add">
              <Fab color="primary" aria-label="add" className="fab-icon">
                <EditIcon className="add-icon" />
              </Fab>
            </Tooltip>
          </Link>
        </Grid>
        :
        <div style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
        >
          <CircularProgress size={80} />
        </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.user
});

export default connect(mapStateToProps)(Profile);

