const express = require('express');
const app = express();
const http = require('http').Server(app);
const port = 8080;

const static_path = express.static(`${__dirname}/../Frontend/`);
console.log(`Static Path: ${__dirname}/../Frontend/`);
app.use(static_path);
http.listen(port, () => console.log('Started Web Server  on *:' + port));