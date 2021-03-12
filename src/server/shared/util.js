//const jsonfile = require("jsonfile");
//const users = "./database/users.json";
//const inventory = "./database/books.json";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongodb = require('mongodb');
const Constants = require("../constants");

//the "sub" (subject) claim identifies the principal that is the subject of the JWT
var getUsernameFromToken = (exports.getUsernameFromToken = (token) => jwt.decode(token)["sub"]);

//The "aud" (audience) claim identifies the recipients that the JWT is intended for
exports.getAudienceFromToken = (token) => jwt.decode(token)["aud"];

//check if an object is empty
exports.isEmptyObject = (object) => Object.entries(object).length === 0;

//compare the given password against the hashed pasword(key) using bcrypt
exports.isPasswordCorrect = async function (password, key) {
  return bcrypt.compare(password, key).then((result) => result);
};

//hash the password using bcrypt
exports.hashPassword = async function hashPassword(password){
  //salt = 12
  return bcrypt.hash(password, 12);
}

//connect to MongoDB database and return collection with a given name
var loadCollectionByName = (exports.loadCollectionByName = async function loadCollectionByName(collectionName) {
  const client = await mongodb.MongoClient.connect(process.env.MONGO_URL);
  return client.db(process.env.MONGO_DBNAME).collection(collectionName);
})

//connect to MongoDB database and return db and client
exports.connectDB = async function connectDB() { 
  const client = await MongoClient.connect(process.env.MONGO_URL);
  return { 
      db: client.db(process.env.MONGO_DBNAME), 
      client: client
  };
}

//get the user object by username from user collection
var getUserByUsername = (exports.getUserByUsername = async function (username) {
  try { 
    const usersCollection = await loadCollectionByName('users');
    const query = { "username": username };
    const filteredUserArray = await usersCollection.find(query).toArray();
    return filteredUserArray.length === 0 ? {} : filteredUserArray[0];
  } catch (err) {
    console.log("Error reading users collection: ", err.message);
  }
});

//the 'login' endpoint will pass only the second param: username 
//any other endpoint will pass only the token itself, second param = null
exports.generateToken = async function (prevToken, userName) {
  //userName is passed only for 'login', otherwise we get the token itself
  const myUserName = userName || getUsernameFromToken(prevToken); //username or username from token
  //get the user object
  const user = await getUserByUsername(myUserName);
  //console.log('SECRET' + process.env.SECRET);

  //obtions object
  const options = {
    algorithm: process.env.ALGORITHM, 
    expiresIn: process.env.EXPIRY,
    issuer: process.env.ISSUER,
    subject: userName || user.username,
    audience:
      user.role === "admin"
        ? Constants.JWT_OPTIONS.ADMIN_AUDIENCE
        : Constants.JWT_OPTIONS.MEMBER_AUDIENCE,
  };
  //we pass a empty payload because we allready add the claims in the options object itself
  //arg: payload, secret, options
  return jwt.sign({}, process.env.SECRET, options);
};

exports.verifyToken = (req, res, next) => {
  //JWT in Auth Header

  //check Auth Header
  if (!req.headers.authorization){
    res.status(401).send({ message: "Not authorized to access data" });
  } else {
    //get JWT from Auth Header
    const token = req.headers.authorization.split(" ")[1];
    if (!token)
      //no JWT in Auth Header
      res.status(401).send({ message: "No authorisation token to access data" });
    else {
      //console.log('token=>' + token);
      jwt.verify(token, process.env.SECRET, function (err) {
        //invalid JWT
        if (err) {
          res.status(401).send({ message: "Please login again" });
        } else next();
      });
    }
  }
};


