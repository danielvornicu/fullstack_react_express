//UserService class version
const UserService = require('../services/user.service'); 
const Constants = require("../constants");
const {
    getUserByUsername, //login
    isEmptyObject, //login
    isPasswordCorrect, //login
    hashPassword, 
    generateToken,
    getAudienceFromToken,
} = require("../shared/util");

class UserController {

    static async login(req, res){
        let base64Encoding = req.headers.authorization.split(" ")[1];
        let credentials = Buffer.from(base64Encoding, "base64").toString().split(":");
        const username = credentials[0];
        const password = credentials[1];
        //get the user object
        console.log(username+":"+password);
        const user = await getUserByUsername(username);
        console.log(user);
        if (user && !isEmptyObject(user)){
            //compare the given password against the hashed pasword(key)
            const passwordOk = await isPasswordCorrect(password, user.key);
            if (!passwordOk) {
                res.status(401)
                   .send({ message: "Username or password is incorrect" });
            } else {
               //JWT in Auth Header:
               //console.log('Auth Header ' + username  +' ' + password);  
               //generate token with given username
               const token = await generateToken(null, username);
               if (token) {
                   res.status(200)
                      .send({ username: user.username, 
                              role: user.role, 
                              access_token: token,
                              expires_in: process.env.EXPIRY 
                            });
               }
            }
        } else {
            res.status(401).send({ message: "Username and password are empty!" });  
        }
    }

    //to logout we need to control the token
    static logout(req, res){
        //JWT in Auth Header: 
       res.status(200).send({ message: "Signed out" });  
    }

    //get all users
    static async findAll(req, res){
        
        //JWT in Auth Header: 
        let token = req.headers.authorization.split(" ")[1];

        //if the token allows to show users
        if (getAudienceFromToken(token).includes(Constants.SHOW_USERS)) {
            try {
                const users = await UserService.findAll();
                if (users && users.length > 0) {
                    //after we get the users list we generate another token from previous one
                    token = await generateToken(token, null);
                    if (token) {
                        res.status(200)
                           .send({ users: users, 
                                   refresh_token: token,
                                   expires_in: process.env.EXPIRY  
                                 });
                    }
                } 
            } catch(err) {
                res.status(500)
                   .send({message: "Error getting users list"});
            }

        } else {
            res.status(403)
               .send({ message: "Not authorized to view users", access_token: token }); 
        }   
    }

    //get user by id
    static async findById(req, res){
        //JWT in Auth Header: 
        let token = req.headers.authorization.split(" ")[1];

        //if the token allows to show users
        if (getAudienceFromToken(token).includes(Constants.SHOW_USERS)) {
            try {
                const user = await UserService.findById(req.params.id);
                if (user) {
                    //after we get the users list we generate another token from previous one
                    token = await generateToken(token, null);
                    if (token) {
                        res.status(200)
                           .send({ user: user, 
                                   refresh_token: token,
                                   expires_in: process.env.EXPIRY  
                                 });
                    }
                } 
            } catch(err) {
                res.status(500)
                   .send({message: "Error getting user with id " + req.params.id });
            }

        } else {
            res.status(403)
               .send({ message: "Not authorized to view user", access_token: token }); 
        } 
    }

    // Create and Save a new user
    static async create(req, res){
        //JWT in Auth Header: 
        let token = req.headers.authorization.split(" ")[1];

        //if the token allows to create a user
        if (getAudienceFromToken(token).includes(Constants.ADD_USER)) {
            
            const hashedPassword = await hashPassword(req.body.password);
            //user object
            const user = { 
                          username  : req.body.username , 
                          key       : hashedPassword,
                          firstName : req.body.firstName , 
                          lastName  : req.body.lastName, 
                          role      : req.body.role
                         };
            
            try{
                const result = await UserService.save(user, true);
                //console.log("result=>"+`${JSON.stringify(result)}`);
                if (result.insertedCount === 1) {
                    /*token = await generateToken(token, null);
                    if (token) {
                        res.status(201)
                            .send({ message: "User added successfully", 
                                    access_token: token,
                                    expires_in: process.env.EXPIRY 
                                });
                    }*/
                    res.redirect('/api/users');
                } 
            }  catch(err) {
                res.status(500)
                   .send({ message: "Cannot add this user" }); 
            }   

        } else {
            res.status(403)
               .send({ message: "Not authorized to add a user", access_token: token }); 
        }  
    }

    // Update a user identified by the id in the request
    static async update(req, res) {
        //JWT in Auth Header: 
        let token = req.headers.authorization.split(" ")[1];

        //if the token allows to modify a user
        if (getAudienceFromToken(token).includes(Constants.UPDATE_USER)) {

            const hashedPassword = await hashPassword(req.body.password);
            //updated user
            const user = { 
                            _id       : req.params.id,
                            username  : req.body.username , 
                            key       : hashedPassword,
                            firstName : req.body.firstName , 
                            lastName  : req.body.lastName, 
                            role      : req.body.role
                         };

            try{
                const result = await UserService.save(user, false);
                //console.log(`res => ${JSON.stringify(result)}`);

                if (result.matchedCount === 1) {
                    /*if (result.modifiedCount === 1){
                        token = await generateToken(token, null);
                        if (token) {
                            res.status(201)
                                .send({ message: "User updated successfully", 
                                        access_token: token,
                                        expires_in: process.env.EXPIRY 
                                    });
                        }
                        
                    } else {
                        res.status(500).send({ message: "User already modified" }); 
                    }*/
                    res.redirect('/api/users');
                } else {
                    res.status(500)
                       .send({message: "User with id " + req.params.id + " not found"}); 
                }
            } catch(err) {
                res.status(500)
                   .send({ message: "Cannot modify this user" });  
            }
                
        } else {
            res.status(403)
               .send({ message: "Not authorized to modify a user", access_token: token }); 
        }          
    }

    // Delete a user with the specified id in the request
    static async delete (req, res) {
        //JWT in Auth Header: 
        let token = req.headers.authorization.split(" ")[1];

        //if the token allows to delete a user
        if (getAudienceFromToken(token).includes(Constants.DELETE_USER)) {
            try {
                const result = await UserService.delete(req.params.id);
                //console.log("result=>"+`${JSON.stringify(result)}`);
                
                if (result.deletedCount === 1) {
                    /*token = await generateToken(token, null);
                    if (token) {
                        res.status(200).send({ users: users, 
                                               access_token: token,
                                               expires_in: process.env.EXPIRY  
                                            });
                    }*/
                    res.redirect('/api/users');
                } else {
                    res.status(500)
                       .send({message: "User with id " + req.params.id + " not found"});
                }
            } catch(err) {
                res.status(500)
                   .send({message: "Error deleting user with id " + req.params.id});
            }

        } else {
            res.status(403)
               .send({ message: "Not authorized to delete a user", access_token: token }); 
        } 
    }
}

module.exports = UserController