Posts App(JWT Auth) - React Frontend Client with Express backend 

node --version /-v=> v12.13.0 (Node version)
npm --version /-v => 6.12.0 (Npm version)
Using 'Create React App' CLI

Set a certificate if necessary:
>set NODE_EXTRA_CA_CERTS=d:\python\examples\heroku\ANFH-CA.cer

Create app 'fullstack_react_express'
Using npx:
>npx create-react-app fullstack_react_express    --capital letters not alowed
Using npm:
>npm init react-app fullstack_react_express
>cd fullstack_react_express
fre>npm start
http://localhost:3000/

SERVER(src/server folder):

Install backend dependencies : 
express, cors, dotenv, uuidv4, cookie-parser(only for cookies), bcryptjs, jsonwebtoken, body-parser, json-server, mongodb, nodemon
>npm i express cors dotenv uuidv4 bcryptjs jsonwebtoken body-parser mongodb --save 
Server run on port 5000:
How do I start the server: go inside the server/ directory and run the command below.
>node server.js

Install nodemon:
>npm i --save-dev nodemon
Modify package.json to add a script:
  "scripts": {
    ...
    "server" : "nodemon src/server/server.js"
  }
Run:
>npm run server 
http://localhost:5000/api/users

MongoDB:
>mongoimport --jsonArray --db PostsDB --collection users --drop --file d:\Demos\fullstack_react_express\src\server\database\users.json
or 
>mongoimport --jsonArray -d PostsDB -c users --drop --file d:\Demos\fullstack_react_express\src\server\database\users.json

mLab:
>mongoimport -h  xxx.mlab.com --port 2700  -d db_name -c collection_name -u user_name -p password  --type json --file  /Path/to/file.json

Bcryptjs:
https://www.fileformat.info/tool/hash.htm
https://bcrypt-generator.com/ - for the same passwork the hash are differents
Member: user 123
Admin: admin 123

JWT: https://jwt.io/

CLIENT(Frontent React App) (src/shared, src/posts, src/users folders)
Install dependecies: jwt-decode, base-64, react-router-dom, @material-ui/core, @material-ui/icons(SVG Icons)
>npm i jwt-decode base-64 react-router-dom @material-ui/core @material-ui/icons

App.js - define routes
util.js - global fonctions
styles.css -- app styles
users
  login.component.js
  user-liste.component.js
  user-fiche.component.js
shared
  AppHeader.component.js
posts
  post-liste.component.js
  post-fiche.component.js
  
Run React App:  
>npm start
http://localhost:3000/

Github:
git add .
git commit -m "first commit"
Connect it to github ad create a new repository: fullstack_react_express
git remote add origin https://github.com/danielvornicu/fullstack_react_express.git
git push -u origin master

Deploy 'fullstack_react_express'(frontend + backend) application on Heroku:
Build the app:
>npm run build  - build and create build folder
>git add build/static/css -f - force to add to github the generated files
>git add build/static/js -f 
Commit to github
Change start command
In package.json, change the “start” command to node server.js so:
   "start": "react-scripts start"  becomes:  "start": "node src/server/server.js"
I prefer to create a Procfile with: web: node src/server/server.js and leave "start": "react-scripts start" 
Procfile
web: src/server/server.js

Add Node and NPM engines that Heroku will use to run your application. 
Preferably, it should be same version you have on your machine.
So, run node -v and npm -v to get the correct version and include it in your package.json file like so:
"engines": {
    "node": "12.13.0",
    "npm": "6.12.0"
  }
In Heroku App-Settings->Config Vars add the variables((copy from src/server/variables.env)
SECRET, ALGORITHM, ISSUER, EXPIRY - for JWT
MONGO_URL, MONGO_DBNAME - for mongoDB database(shared in MongoDB Atlas)

Deploy 'fullstack_react_express'(front end static files only) application on Surge:
1.install Surge globally:
>npm install --global surge
2.Build your project using npm run build:
>npm run build
3.Now, run surge from within any directory, to publish that directory onto the web.
>cd build
Set a certificate if necessary:
>set NODE_EXTRA_CA_CERTS=d:\python\examples\heroku\ANFH-CA.cer
5. Execute surge command:
>surge enter email and password and domain: fullstack-express-react.surge.sh
Go to generated domain: http://fullstack-express-react.surge.sh


  








  


