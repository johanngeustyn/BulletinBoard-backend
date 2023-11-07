const library = require('./config/library');
const files = require('./config/files');
const noticeRoutes = require("./routes/notice");
const userRoutes = require("./routes/user");

const app = library.express();

// Applying helmet to enhance API's security
app.use(library.helmet());

// Using morgan to log every request to the console
app.use(library.morgan('combined'));

const API_ENDPOINT = '/api';

const dbOptions = {
    sslCAFile: files.certPath, 
    useNewUrlParser: true,
    useUnifiedTopology: true
};

library.mongoose.connect(process.env.DB_URL)
    .then(() => {
        console.log('Connected to MongoDB')
    }).catch(err => {
        console.error('Connection to MongoDB failed: ', err);
    });

app.use(library.express.json());

// CORS Middleware
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', '*');
    next();
});

app.use(API_ENDPOINT + '/notices', noticeRoutes);
app.use(API_ENDPOINT + '/users', userRoutes);

// Error Handling Middleware
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({ message: error.message || 'An unknown error occurred' });
});

module.exports = app;




