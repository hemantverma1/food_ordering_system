# Food Ordering System for a local cafeteria 

### Run Locally on Your Machine
You need Node, NPM and MongoDB properly installed.

Setup the environment variables replacing <MONGODB-PORT> with your mongodb port, usually is 27017.
``` shell
    export MONGO_DB_URI=mongodb://localhost:<MONGODB-PORT>/shopping
```
Install dependencies
``` shell
    npm install
```
Seed the Database (for the very first run only)
``` shell
    node seed/product-seeder.js
```
Run the Server
``` shell
    npm start
```
### Technologies
###### Back-end
NodeJS, Express, MongoDB, Mongoose. 
###### Fron-end
Handlebars and Bootstrap.
