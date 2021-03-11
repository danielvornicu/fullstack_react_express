require("dotenv").config({ path: "../shared/variables.env" });
const express = require('express');
//const mongodb = require('mongodb');
const Constants = require("../constants");
const { verifyToken} = require("../shared/util");
const PostController = require("../controllers/post.controller");

const router = express.Router();

//CRUD
// get all posts
router.get('/', verifyToken, PostController.findAllByUserId);

// Create a new post
router.post("/new", verifyToken, PostController.create);

// get a single post by id
router.get('/:id', verifyToken, PostController.findById);

// Update a post with id
router.post('/:id/edit', verifyToken, PostController.update);

// Delete a post by id and return remaining posts list
router.get('/:id/delete', verifyToken, PostController.delete);


module.exports = router;