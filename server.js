require('./config');
const library = require('./config/library');
const files = require('./config/files');
const app = require('./app');

const options = {
    key: files.key,
    cert: files.cert
};

const server = library.https.createServer(options, app);

server.listen(process.env.PORT);

