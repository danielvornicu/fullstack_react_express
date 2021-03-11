const mongodb = require('mongodb');
const { loadCollectionByName } = require("../shared/util");

class PostService {
    
    // get all posys
    static async findAll() {
        try {
            const postsCollection = await loadCollectionByName('posts');
            const options = {
                            projection: { _id: 1, text: 1, createdAt: 1, updatedAt: 1, user_id: 1},
                           };
    
            return await postsCollection.find({}, options).toArray();
        } catch (err) {
          console.log("Error reading posts from datastore: ", err.message);
          throw Error(err.message)
        }
    };

    //get post by id
    static async findById(id) {
        try {
            const postsCollection = await loadCollectionByName('posts');
            const options = {
                             projection: { _id: 1, text: 1, createdAt: 1, updatedAt: 1, user_id: 1},
                            };        
            const query = { _id: mongodb.ObjectID(id) };
            return await postsCollection.findOne(query, options);         
        } catch (err) {
          console.log("Error reading post from datastore: ", err.message);
          throw Error(err.message)
        }
    };

    //get post by user id
    static async findAllByUserId(userId) {
        try {
            const postsCollection = await loadCollectionByName('posts');
            const options = {
                                projection: { _id: 1, text: 1, createdAt: 1, updatedAt: 1, user_id: 1},
                            };        
            const query = { user_id: mongodb.ObjectID(userId) };
            return await postsCollection.find(query, options).toArray();       
        } catch (err) {
            console.log("Error reading posts from datastore: ", err.message);
            throw Error(err.message)
        }
    };

    // create new post or update existing one(HTTP POST)
    static async save(post, isCreation) {
        try {
            const postsCollection = await loadCollectionByName('posts');

            if (isCreation){
              // Save the new post in the database
              return await postsCollection.insertOne(post);
            } else {
              // Find post and update it  
              const updatedPost = {
                    $set: {
                            text     : post.text,
                            updatedAt : post.updatedAt
                          }
              };

              const query = { _id: mongodb.ObjectID(post._id) };

              return await postsCollection.updateOne(query, updatedPost);
            }
        } catch (err) {
            console.log("Error saving post to datastore: ", err.message);
            throw Error(err.message);
        }
    };

    static async delete(id){
        try {
            const postsCollection = await loadCollectionByName('posts');

            const query = { _id: mongodb.ObjectID(id) };          
            return await postsCollection.deleteOne(query);
    
        } catch (err) {
          console.log("Error deleting post from datastore: ", err.message);
          throw Error(err.message)
        }
    }
}

module.exports = PostService