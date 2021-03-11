import React, { useState, useEffect } from "react";
import { Avatar, Grid, 
   Card, CardHeader, CardContent, CardActions, IconButton, 
   Typography, Button 
} from "@material-ui/core";

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import "../styles.css";
import { AppHeader } from "../shared/AppHeader.component";
import { constructHeader, isAdmin, updateAppSettings } from "../util";
import { useHistory } from "react-router-dom";
import {API_BASE_URL} from "../shared/constants";

const USER_API_BASE_URL = API_BASE_URL + "/users";

export const UserListeComponent = () => {
  const [users, setUsers] = useState([]);
  const history = useHistory();
  const showPage = isAdmin();

  const redirectToLoginPage = () => {
    localStorage.clear();
    history.push("/login");
  };

  const fetchUsers = async function(){
    try{
      let res = await fetch(USER_API_BASE_URL, { headers: constructHeader() });
      let json;
      if (res.status === 401){
        redirectToLoginPage();
      } else {
        json = await res.json();
      }
      if (json) {
          updateAppSettings(json.access_token);
          setUsers([...json.users]);
      }

    } catch(err){
      console.log("Error fetching users ", err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="Content">
      <AppHeader tabValue={2} />
      {!showPage && (<Grid container justify="center" direction="column" alignItems="center">
                      <Grid item style={{ marginBottom: "5vh" }}>
                        <Typography variant="h6" gutterBottom>
                          Admin area only
                        </Typography>
                      </Grid>
                     </Grid>)}
      {showPage && (
        <Grid container justify="center" direction="column" alignItems="center">
          <Grid item style={{ marginBottom: "5vh" }}>
            <Typography variant="h3" gutterBottom>
              Users List
            </Typography>
          </Grid>
          
          <Grid item container justify="center" xs={12}>
            {users && users.map((user, key) => {
              return (
                <User
                  id = {user._id}
                  key={key}
                  userName={user.username}
                  firstName={user.firstName}
                  lastName={user.lastName}
                  role={user.role}
                />
              );
            })}
          </Grid>
        </Grid>
      )}
    </div>
  );
};

const User = ({id, firstName, lastName, userName, role }) => {

  const history = useHistory();

  const redirectToLoginPage = () => {
    localStorage.clear();
    history.push("/login");
  };

  const refreshPage = () => {
    window.location.reload(false);
  }

  const onDelete = () => {
    deleteById(id);
  };

  function onEdit(){
    history.push("/users/"+ id + "/edit");
  };

  //delete a user by id (HTTP GET)
  async function deleteById(id){
    try{
      let url = USER_API_BASE_URL + "/" + id + "/delete";

      let res = await fetch(url, { headers: constructHeader() });
      let json;
      if (res.status === 401){
        redirectToLoginPage();
      } else {
        json = await res.json();
      }
      if (json) {
          updateAppSettings(json.access_token);
          refreshPage();
      }

    } catch(err){
      console.log("Error deleting user ", err.message);
    }
  }

  return (
    <Card elevation={3} className="User">

      <CardHeader
        avatar={
          <Avatar aria-label="User Avatar">
            {userName.charAt(0)}
          </Avatar>
        }
        title={
          <Typography variant="body2" gutterBottom>
            {userName + " (" + role + ") "}
          </Typography>
        }
      />

      <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            {firstName + " " + lastName}
          </Typography>
      </CardContent>

      <CardActions disableSpacing style={{ width: '100%', justifyContent: 'flex-end' }} >
        <IconButton aria-label="Edit Post"  onClick={onEdit} color="primary">
          <EditIcon fontSize="small"/>
        </IconButton>
        <IconButton aria-label="Delete Post"  onClick={onDelete} color="secondary" edge="end">
          <DeleteIcon fontSize="small"/>
        </IconButton>
      </CardActions>

    </Card>


  );
};