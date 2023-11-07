const library = require('./library');

const key = library.fs.readFileSync('./keys/privatekey.pem');
const cert = library.fs.readFileSync('./keys/certificate.pem');
const keyPath = library.path.join('keys', 'privatekey.pem');
const certPath = library.path.join('keys', 'certificate.pem');

module.exports = {
    key,
    cert,
    keyPath,
    certPath
}