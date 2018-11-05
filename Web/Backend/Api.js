const http = require('http');
const app = require('./Api/app');
const port = process.env.API_PORT || 8081;
const server = http.createServer(app);
server.listen(port, () => console.log(`Started API on *:${port}`));