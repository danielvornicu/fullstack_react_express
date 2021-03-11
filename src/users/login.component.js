import React, { useState } from "react";
import { Grid, Typography, TextField, Button } from "@material-ui/core";
import PostAdd from '@material-ui/icons/PostAdd';
import { useHistory } from "react-router-dom";
import { updateAppSettings } from "../util";
//let base64 = require("base-64");
import base64 from "base-64"; //ES2015 (ES6)
let headers = new Headers();
const url = "http://localhost:5000/api/users/login";

export const Login = () => {

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const history = useHistory();

  const onChangeUsername = (username) => setUserName(username);
  const onChangePassword = (password) => setPassword(password);

  const onClickLogin = async function () {
    //name Authorization, value Basic xxx
    headers.set(
      "Authorization", "Basic " + base64.encode(userName + ":" + password)
    );

    try{
      let res = await fetch(url, { headers: headers, method: "POST" });
      let json = await res.json();

      if (json.message) { 
        setLoginError(json.message);
      } else {
          updateAppSettings(json.access_token);
          history.push("/posts");
      }
    } catch(err){
      console.log("Error logging into app ", err.message);
    }
  };

  return (
    <Grid container direction="column" alignItems="center" style={{ marginTop: "10vh" }}>
      <Grid item style={{ marginBottom: "10vh" }}>
        <Typography variant="h3" color="primary">
          Welcome to PostIt!
          <PostAdd fontSize="large" color="primary"/>
        </Typography>
      </Grid>
      <Grid item style={{ marginBottom: "2vh" }}>
        <TextField 
          variant="outlined" 
          id="username-input"
          label="username"
          value={userName}
          onChange={(e) => onChangeUsername(e.target.value)}
        />
      </Grid>
      <Grid item style={{ marginBottom: "2vh" }}>
        <TextField 
          variant="outlined" 
          id="password-input"
          label="password"
          type="password"
          value={password}
          onChange={(e) => onChangePassword(e.target.value)}
        />
      </Grid>
      <Grid item style={{ marginBottom: "5vh" }}>
        <Button
          aria-label="login"
          variant="contained"
          size="medium"
          color="primary"
          onClick={onClickLogin}>Login
        </Button>
      </Grid>
      <Grid item>
        <Typography variant={"body2"} color={"error"}>
          {loginError}
        </Typography>
      </Grid>
    </Grid>
  );
};