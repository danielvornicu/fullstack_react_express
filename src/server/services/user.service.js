const mongodb = require('mongodb');
const { loadCollectionByName } = require("../shared/util");

class UserService {

    // get all users
    static async findAll() {
        try {
            const usersCollection = await loadCollectionByName('users');
            const options = {
                // sort matched documents in descending order by username
                sort: { username: -1 },
                // Include only username, firstName, lastName and role fields in the returned document
                projection: { _id: 1, username: 1, firstName: 1, lastName : 1, role : 1 },
            };
        
            //return only fields with value 1 in projection
            const allUsers = await usersCollection.find({}, options).toArray();
            return allUsers;
    
        } catch (err) {
          console.log("Error reading users from datastore: ", err.message);
          throw Error(err.message)
        }
    };

    //get user by id
    static async findById(id) {
        try {
            const usersCollection = await loadCollectionByName('users');
            const options = {
                // Include only username, firstName, lastName and role fields in the returned document
                projection: { _id: 1, username: 1, firstName: 1, lastName : 1, role : 1 },
            };        
            const query = { _id: mongodb.ObjectID(id) };
            const user = await usersCollection.findOne(query, options);         
            return user;
    
        } catch (err) {
          console.log("Error reading user from datastore: ", err.message);
          throw Error(err.message)
        }
    };

    // create new user or update existing one(HTTP POST)
    static async save(user, isCreation) {
        try {
            const usersCollection = await loadCollectionByName('users');

            if (isCreation){
              // Save the new user in the database
              //console.log(user.key);
              return await usersCollection.insertOne(user);
            } else {
              // Find user and update it  
              // Set some fields in that document
              const updatedUser = {
                    $set: {
                            username  : user.username,
                            key       : user.key, 
                            firstName : user.firstName, 
                            lastName  : user.lastName, 
                            role      : user.role
                         }
              };

              const query = { _id: mongodb.ObjectID(user._id) };

              return await usersCollection.updateOne(query, updatedUser);
            }
        } catch (err) {
            console.log("Error saving the user to datastore: ", err.message);
            throw Error(err.message);
        }
    };

    static async delete(id){
        try {
            const usersCollection = await loadCollectionByName('users');

            const query = { _id: mongodb.ObjectID(id) };          
            return await usersCollection.deleteOne(query);
    
        } catch (err) {
          console.log("Error deleting user from datastore: ", err.message);
          throw Error(err.message)
        }
    }
}
 
module.exports = UserService
