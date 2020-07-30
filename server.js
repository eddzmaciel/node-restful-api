//provide funcntionality for server
const http = require('http');
const app = require('./app');


//where to run my project
const port = process.env.PORT || 3000;

//add the listener to handle coming request
const server = http.createServer(app);

server.listen(port);


