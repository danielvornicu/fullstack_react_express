require("dotenv").config({ path: __dirname + "/variables.env" });
const express = require("express");
const cors = require("cors");  
//const bodyParser = require('body-parser');
//const { uuid } = require("uuidv4");

const app = express();


// Middleware
app.use(express.json());
//app.use(bodyParser.json());
app.use(cors());

const users = require('./routes/user.routes');
const posts = require('./routes/post.routes');
app.use('/api/users', users);
app.use('/api/posts', posts);


//APP settings
// Serve only the static files form the build directory
app.use(express.static('build'));

//Wait for a request to any path and redirect all of the requests to index.html
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));




