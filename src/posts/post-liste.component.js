import React, { useState, useEffect } from "react";
import { Grid, 
       Avatar, Card, CardHeader, CardContent, CardActions, IconButton, 
        Typography, Button 
       } from "@material-ui/core";

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import "../styles.css";
import { AppHeader } from "../shared/AppHeader.component";
import { constructHeader, updateAppSettings } from "../util";
import { useHistory } from "react-router-dom";
import {API_BASE_URL} from "../shared/constants";

const POST_API_BASE_URL = API_BASE_URL + "/posts";

export const PostListeComponent = () => {
  const [posts, setPosts] = useState([]);
  const history = useHistory();

  const redirectToLoginPage = () => {
    localStorage.clear();
    history.push("/login");
  };

  const fetchPosts = async function(){
    try{
      let res = await fetch(POST_API_BASE_URL, { headers: constructHeader() });

      let json;
      if (res.status === 401){
        redirectToLoginPage();
      } else {
        json = await res.json();
      }

      if (json) {
          updateAppSettings(json.access_token);
          setPosts([...json.posts]);
      }

    } catch(err){
      console.log("Error fetching posts ", err.message);
    }
  };

  function formatDate(dateStr) {
    var date = new Date(dateStr);

    const month = date.getMonth() + 1;
    const day   = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const monthString = month >= 10 ? month : `0${month}`;
    const dayString    = day >= 10 ? day : `0${day}`;
    const hoursString = hours >= 10 ? hours : `0${hours}`;
    const minutesString = minutes >= 10 ? minutes : `0${minutes}`;

    return `${dayString}/${monthString}/${date.getFullYear()} at ${hoursString}h${minutesString}`;
  }

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="Content">
      <AppHeader tabValue={0} />
      {(
        <Grid container justify="center" alignItems="center" direction="column" >

          <Grid item style={{ marginBottom: "5vh" }}>
            <Typography variant="h3" gutterBottom>
              Posts List
            </Typography>
          </Grid>
          
          <Grid item container justify="center" >
            {posts && posts.map((post, key) => {
              return (
                <Post
                  key={key}
                  id = {post._id}
                  text={post.text}
                  createdAt = {formatDate(post.createdAt)}
                  user_id = {post.user_id}
                />
              );
            })}
          </Grid>

        </Grid>
      )}
    </div>
  );
};

const Post = ({id, text, createdAt, user_id }) => {

  const history = useHistory();

  const refreshPage = () => {
    window.location.reload(true);
  }

  const onDelete = () => {
    deleteById(id);
  };

  function onEdit(){
    history.push("/posts/"+ id + "/edit");
  };

  //delete a post by id (HTTP GET)
  async function deleteById(id){
    try{
      let url = POST_API_BASE_URL + "/" + id + "/delete";

      let res = await fetch(url, { headers: constructHeader() });
      let json = await res.json();
      if (json) {
          updateAppSettings(json.access_token);
          refreshPage();
          //history.push("/posts");
      }

    } catch(err){
      console.log("Error deleting post ", err.message);
    }
  }

  return (
    <Card elevation={3} className="Post">
      <CardContent>
          <Typography gutterBottom variant="h6" gutterBottom color="primary" component="h2">
             {text}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
             {createdAt}
          </Typography>
      </CardContent>

      <CardActions disableSpacing style={{ width: '100%', justifyContent: 'flex-end' }}>
        <IconButton aria-label="Edit Post" onClick={onEdit} color="primary">
          <EditIcon fontSize="small"/>
        </IconButton>
        <IconButton aria-label="Delete Post" onClick={onDelete} color="secondary" edge="end">
          <DeleteIcon fontSize="small"/>
        </IconButton>
      </CardActions>
      
    </Card>
  );
};