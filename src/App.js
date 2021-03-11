import React from "react";
import "./styles.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Login } from "./users/login.component";
import { UserListeComponent } from "./users/user-liste.component";
import { UserFicheComponent } from "./users/user-fiche.component";
import { PostListeComponent } from "./posts/post-liste.component";
import { PostFicheComponent } from "./posts/post-fiche.component";

export default function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/"><Login /></Route>
          <Route exact path="/login"><Login /></Route>
          
          <Route exact path="/users"><UserListeComponent/></Route>
          <Route exact path="/users/new"><UserFicheComponent/></Route>
          <Route exact path="/users/:id/edit"><UserFicheComponent/></Route>   

          <Route exact path="/posts"><PostListeComponent/></Route> 
          <Route exact path="/posts/new"><PostFicheComponent/></Route>
          <Route exact path="/posts/:id/edit"><PostFicheComponent/></Route>     
        </Switch>
      </Router>
    </div>
  );
}
