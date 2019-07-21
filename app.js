// Requires
let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');

// Init var.
let app = express();

// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// Import routes
let appRoutes = require('./routes/app');
let userRoutes = require('./routes/user');
let authRoutes = require('./routes/login');
let uploadRoutes = require('./routes/upload');
let imageRoutes = require('./routes/img');

// Connect to db
mongoose.connection.openUri('mongodb://localhost:27017/peruappsDB', ( err, resp ) => {
    
    if ( err ) throw err;

    console.log('Database : \x1b[36m%s\x1b[0m', 'online'); 

});

// Routes
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/upload', uploadRoutes);
app.use('/imgs', imageRoutes);
app.use('/', appRoutes);

// Listen request
app.listen(3000, () => {
    console.log('Node/Express running : \x1b[36m%s\x1b[0m', 'online'); 
})