const library = require('./library');

const key = library.fs.readFileSync('keys/privatekey.pem');
const cert = library.fs.readFileSync('keys/certificate.pem');

module.exports = {
    key,
    cert
}