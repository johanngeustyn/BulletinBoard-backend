const library = require('./library');
library.dotenv.config();

if (!process.env.JWT_SECRET) {
    const secret = library.crypto.randomBytes(32).toString('hex');
    library.fs.appendFileSync('.env', `\nJWT_SECRET=${secret}`);
    library.dotenv.config();
}