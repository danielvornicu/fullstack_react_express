import React from "react";
import "../styles.css";
import {
  AppBar,
  Tab,
  Tabs,
  MenuItem,
  IconButton,
  Menu,
  Toolbar,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { constructHeader, isMember } from "../util";
import {API_BASE_URL} from "../shared/constants";

const url = API_BASE_URL + "/users/logout";

export const AppHeader = ({ tabValue }) => {
  const tabs = ["/posts", "/posts/new", "/users", "/users/new"];
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const history = useHistory();
  const shouldDisable = isMember();

  const handleClick = (event, newValue) => history.push(tabs[newValue]);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onClickLogout = () => {
    fetch(url, { headers: constructHeader() }).then((res) => {
      localStorage.clear();
      history.push("/login");
    });
  };

  return (
    <div style={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <Tabs value={tabValue} onChange={handleClick}>
            <Tab label="Posts" />
            <Tab label="Add post" />
            <Tab label="Users" disabled={shouldDisable} />
            <Tab label="Add User" disabled={shouldDisable} />
          </Tabs>
          <div style={{ flexGrow: 1 }} />
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem>{localStorage.getItem("displayName")}</MenuItem>
            <MenuItem onClick={onClickLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </div>
  );
};