import { Divider } from "@material-ui/core";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { database } from '../../firebase/firebase.utils';


export class DspaceMemberList extends Component {

  state = {
    dSpace:null
  };

    constructor(props) {
      super(props);
      this.getDspaceMembers();
    }

  getDspaceMembers( ) {
    database.collection('d-spaces').doc(this.props.dSpaceId)
    .get()
        .then(doc => {
            if (!doc.exists) {
            } else {
            //   this.setState({ userInfo: doc.data(), userDataReceived: true, joined: doc.data().dspaces.includes(dSpace.id) })
                this.setState({dSpace:doc.data()})
            }
            })
            .catch(err => {
            console.log('Error getting document', err);
        });
  }

  displayMembers() {
    for(let i =0; i<this.state.dSpace.members.length; i++) {

      return(
        <p>{this.state.dSpaceMembers[i].name}</p>
      )
    }
  }

  render() {
    if(this.state.dSpace)
            return(  
                <div>
                <List component="nav" aria-label="main mailbox folders">
                {
                  this.state.dSpace.members.map((member) => {
                  return (
                    <div>
                      <Link to={`/id=${member.rollNumber}`}>
                        <ListItem button>
                          <ListItemText primary={member.name} />
                        </ListItem>
                        </Link>
                        <Divider component="li" />
                      </div>
                  )})
                }
                </List>
                </div>
            );
    else return (
      <p>loading</p>
      )
    }
  }


export default DspaceMemberList;
