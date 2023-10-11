const library = require('./config/library');
const files = require('./config/files');
const fruitRoutes = require("./routes/fruit");
const userRoutes = require("./routes/user");

const app = library.express();
const API_ENDPOINT = '/api';

const options = {
    server: { 
        sslCA: files.cert 
    }
};

library.mongoose.connect(process.env.DB_URL)
    .then(() => {
        console.log('Connected')
    }).catch(err => {
        console.error('NOT connected: ', err);
    }, options);

app.use(library.express.json());

app.use((reg, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization');
    res.setHeader('Access-Control-Allow-Methods', '*');
    next();
});

app.get(API_ENDPOINT + '/', (req, res) => {
    res.send('Hello World');
});

app.use(API_ENDPOINT + '/fruits', fruitRoutes);
app.use(API_ENDPOINT + '/users', userRoutes);

module.exports = app;




