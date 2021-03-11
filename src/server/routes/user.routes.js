const express = require('express');
//const Constants = require("../constants");
const {verifyToken} = require("../shared/util");
const UserController = require("../controllers/user.controller");

const router = express.Router();

// login
router.post("/login", UserController.login);
// logout, we need the token
router.get("/logout", verifyToken, UserController.logout);

//CRUD
// get all users
router.get('/', verifyToken, UserController.findAll);

// Create a new user
router.post("/new", verifyToken, UserController.create);

// get a single user by id
router.get('/:id', verifyToken, UserController.findById);

// Update a user with id
router.post('/:id/edit', verifyToken, UserController.update);

// Delete a user by id and return remaining user list
router.get('/:id/delete', verifyToken, UserController.delete);


module.exports = router;