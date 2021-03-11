const PostService = require('../services/post.service'); 
const Constants = require("../constants");
const {
    hashPassword, 
    generateToken,
    getUsernameFromToken,
    getUserByUsername
} = require("../shared/util");

class PostController {

    //get all posts
    static async findAllByUserId(req, res){
    
        //JWT in Auth Header: 
        let token = req.headers.authorization.split(" ")[1];
        const username = getUsernameFromToken(token);
        //get the user object
        const user = await getUserByUsername(username);
        try {
            const posts = await PostService.findAllByUserId(user._id);
            if (posts && posts.length > 0) {
                //after we get the users list we generate another token from previous one
                token = await generateToken(token, null);
                if (token) {
                    res.status(200)
                        .send({ posts: posts, 
                                refresh_token: token,
                                expires_in: process.env.EXPIRY  
                                });
                }
            } 
        } catch(err) {
            res.status(500)
                .send({message: "Error getting post list for user"});
        } 
    }

    //get post by id
    static async findById(req, res){
        //JWT in Auth Header: 
        let token = req.headers.authorization.split(" ")[1];
        try {
            const post = await PostService.findById(req.params.id);
            if (post) {
                //after we get the posts list we generate another token from previous one
                token = await generateToken(token, null);
                if (token) {
                    res.status(200)
                        .send({ post: post, 
                                refresh_token: token,
                                expires_in: process.env.EXPIRY  
                                });
                }
            } 
        } catch(err) {
            res.status(500)
                .send({message: "Error getting post with id " + req.params.id });
        }

        
    }

    // Create and Save a new post
    static async create(req, res){
        //JWT in Auth Header: 
        let token = req.headers.authorization.split(" ")[1];
        const username = getUsernameFromToken(token);
        //get the user object
        const user = await getUserByUsername(username);
            
        //post object
        const post = { 
                        text      : req.body.text, 
                        createdAt : new Date(Date.now()), 
                        user_id   : user._id
                        };
        
        try{
            const result = await PostService.save(post, true);
            //console.log("result=>"+`${JSON.stringify(result)}`);
            if (result.insertedCount === 1) {
                res.redirect('/api/posts');
            } 
        }  catch(err) {
            res.status(500)
                .send({ message: "Cannot add this post" }); 
        }      
    }

    // Update a post identified by the id in the request
    static async update(req, res) {
        //JWT in Auth Header: 
        let token = req.headers.authorization.split(" ")[1];
        //updated post
        const post = { 
                        _id       : req.params.id,
                        text      : req.body.text , 
                        updatedAt : new Date(Date.now()), 
                        };

        try{
            const result = await PostService.save(post, false);
            //console.log(`res => ${JSON.stringify(result)}`);
            if (result.matchedCount === 1) {
                res.redirect('/api/posts');
            } else {
                res.status(500)
                    .send({message: "Post with id " + req.params.id + " not found"}); 
            }
        } catch(err) {
            res.status(500)
                .send({ message: "Cannot modify this post" });  
        }         
    }

    // Delete a user with the specified id in the request
    static async delete (req, res) {
        //JWT in Auth Header: 
        let token = req.headers.authorization.split(" ")[1];

        try {
            const result = await PostService.delete(req.params.id);
            //console.log("result=>"+`${JSON.stringify(result)}`);
            if (result.deletedCount === 1) {

                res.redirect('/api/posts');
            } else {
                res.status(500)
                    .send({message: "Post with id " + req.params.id + " not found"});
            }
        } catch(err) {
            res.status(500)
                .send({message: "Error deleting post with id " + req.params.id});
        }
    }
}

module.exports = PostController