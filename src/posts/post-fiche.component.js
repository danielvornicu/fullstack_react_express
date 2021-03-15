import React, { useState, useEffect } from "react";
import { Grid,Typography,Button,TextField, TextareaAutosize,Switch } from "@material-ui/core";
import "../styles.css";
import { AppHeader } from "../shared/AppHeader.component";
import { constructHeader, updateAppSettings } from "../util";
import { useParams, useHistory } from "react-router-dom";
import {API_BASE_URL} from "../shared/constants";

const POST_API_BASE_URL = API_BASE_URL + "/posts";

export const PostFicheComponent = () => {
  const [text, setText] = useState("");

  const history = useHistory();
  const { id } = useParams();

  const onChangeText = (text) => setText(text);

  const clearTextFields = () => {
    setText("");
  };

  const redirectToLoginPage = () =>{
    localStorage.clear();
    history.push("/login");
  };


  useEffect(() => {
    if (id){
      fetchPost(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchPost = async function (id) {
    try{
      let url = POST_API_BASE_URL + "/" + id;

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
          setText(json.post.text);
      }

    } catch(err){
      console.log("Error getting post ", err.message);
    }
  }

  const save = async function () {
      try{
        let url;
        const post     = {  _id : id,
                            text: text
                         };
        
        if (typeof(id) === 'undefined'){//creation
          url = POST_API_BASE_URL + '/new';
        } else { //modification
          url = POST_API_BASE_URL + '/' + id + '/edit';
        }
  
        let res = await fetch(url, { headers: constructHeader("application/json"),
                                     method: "POST",
                                     body: JSON.stringify(post),
                                   });
 
        if (res.status === 200) 
          clearTextFields();
        
        let json = await res.json();
  
        if (json) {
            updateAppSettings(json.access_token || "");
            history.push("/posts");
        }
      }catch(err){
        console.log("Error saving post ", err.message);
      }
  }

  const onValidate = () => {
    save();
  };

  const onCancel = () => {
    history.push("/posts");
  };

  const getTitle = () => {
    if(typeof(id) === 'undefined'){
        return "Add New Post";
    }else{
        return "Edit Post ";
    }
};

  return (
    <div className="AddPost">
      <AppHeader tabValue={1} />
      {(
      <Grid container direction="column" alignItems="center">
        <Grid item style={{ marginBottom: "5vh" }}>
          <Typography variant="h3" gutterBottom>
             {getTitle()}
          </Typography>
        </Grid>
        <Grid item style={{ marginBottom: "5vh" }}>
          <TextareaAutosize style={{ width: 200, height: 100 }}
            height = "10em"
            placeholder="Add text"
            id="text-input"
            variant="outlined"
            label="Post"
            value={text}
            onChange={(e) => onChangeText(e.target.value)}
          />
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