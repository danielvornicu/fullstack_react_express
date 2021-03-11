import React, { useState, useEffect } from "react";
import { Grid,Typography,Button,TextField, Switch } from "@material-ui/core";
import "../styles.css";
import { AppHeader } from "../shared/AppHeader.component";
import { constructHeader, isAdmin, updateAppSettings } from "../util";
import { useParams, useHistory } from "react-router-dom";
import {API_BASE_URL} from "../shared/constants";

const USER_API_BASE_URL = API_BASE_URL + "/users";


export const UserFicheComponent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [adminProfile, setAdminProfile] = useState(false);

  const history = useHistory();
  const { id } = useParams();
  const showPage = isAdmin();

  const onChangeUsername = (username) => setUsername(username);
  const onChangePassword = (password) => setPassword(password);
  const onChangeFirstName = (firstName) => setFirstName(firstName);
  const onChangeLastName = (lastName) => setLastName(lastName);


  const toggleChecked = () => {
    setAdminProfile((prev) => !prev);
  };

  const clearTextFields = () => {
    setUsername("");
    setPassword("");
    setFirstName("");
    setLastName("");
  };

  const redirectToLoginPage = () =>{
    localStorage.clear();
    history.push("/login");
  };

  useEffect(() => {
    fetchUser(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUser = async function (id) {
    try{

      let url;
      if(typeof(id) === 'undefined'){
        url = USER_API_BASE_URL + "/new";
      } else {
        url = USER_API_BASE_URL + "/" + id;
      }

      let res = await fetch(url, { headers: constructHeader() });
      let json;
      if (res.status === 401){
        redirectToLoginPage();
      } else {
        json = await res.json();
      }

      if (json) {
          updateAppSettings(json.refresh_token);
          //
          setUsername(json.user.username);
          setPassword(json.user.password);
          setFirstName(json.user.firstName);
          setLastName(json.user.lastName);
      }

    } catch(err){
      console.log("Error getting user ", err.message);
    }
  }

  const save = async function () {
      try{
        let url;
        const user     = { _id : id,
                            username: username, 
                            password: password || "", 
                            firstName: firstName, 
                            lastName: lastName, 
                            role: adminProfile ? 'admin': 'user'
                         };
        
        if (typeof(id) === 'undefined'){//creation
          url = USER_API_BASE_URL + '/new';
        } else { //modification
          url = USER_API_BASE_URL + '/' + user._id + '/edit';
        }
  
        let res = await fetch(url, { headers: constructHeader("application/json"),
                                     method: "POST",
                                     body: JSON.stringify(user),
                                   });
        if (res.status === 401){
          redirectToLoginPage();
        } else {
          if (res.status === 200) clearTextFields();
        }
        let json = await res.json();
  
        if (json) {
            updateAppSettings(json.access_token || "");
            history.push("/users");
        }
      }catch(err){
        console.log("Error saving user ", err.message);
      }
  }

  const onValidate = () => {
    save();
  };

  const onCancel = () => {
    history.push("/users");
  };

  const getTitle = () => {
    if(typeof(id) === 'undefined'){
        return "Add New User";
    }else{
        return "Edit User ";
    }
};

  return (
    <div className="AddUser">
      <AppHeader tabValue={3} />
      {!showPage && (<Grid container justify="center" direction="column" alignItems="center">
                      <Grid item style={{ marginBottom: "5vh" }}>
                        <Typography variant="h6" gutterBottom>
                          Admin area only
                        </Typography>
                      </Grid>
                     </Grid>)}
      {showPage && (
      <Grid container direction="column" alignItems="center">
        <Grid item style={{ marginBottom: "5vh" }}>
          <Typography variant="h3" gutterBottom>
             {getTitle()}
          </Typography>
        </Grid>
        <Grid item style={{ marginBottom: "5vh" }}>
          <TextField
            id="username-input"
            variant="outlined"
            label="username"
            value={username}
            onChange={(e) => onChangeUsername(e.target.value)}
          />
        </Grid>
        <Grid item style={{ marginBottom: "5vh" }}>
          <TextField
            id="password-input"
            variant="outlined"
            label="password"
            value={password}
            onChange={(e) => onChangePassword(e.target.value)}
          />
        </Grid>
        <Grid item style={{ marginBottom: "5vh" }}>
          <TextField
            id="firstName-input"
            variant="outlined"
            label="First Name"
            value={firstName}
            onChange={(e) => onChangeFirstName(e.target.value)}
          />
        </Grid>
        <Grid item style={{ marginBottom: "5vh" }}>
          <TextField
            id="lastName-input"
            variant="outlined"
            label="Last Name"
            value={lastName}
            onChange={(e) => onChangeLastName(e.target.value)}
          />
        </Grid>
        <Grid item style={{ marginBottom: "5vh" }}>
          <Typography variant="body2" gutterBottom>
             Admin profile:
            <Switch
              checked={adminProfile}
              color="primary"
              name="isAdmin"
              inputProps={{ 'aria-label': 'primary checkbox' }}
              onChange={toggleChecked}
            />
          </Typography>
        </Grid>


        <Grid item container direction="row" spacing={1} alignItems="center" justify="center" style={{ marginBottom: "7vh" }}>
          <Grid item>
            <Button
              aria-label="login"
              variant="contained"
              size="large"
              color="primary"
              onClick={onValidate}>Validate
            </Button>
          </Grid>
          <Grid item>
            <Button
              aria-label="login"
              variant="contained"
              size="large"
              color="secondary"
              onClick={onCancel}>Cancel
            </Button>
          </Grid>
        </Grid>
      </Grid>
      )}
    </div>
  );
};