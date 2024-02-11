const express = require('express');
const fs = require('fs');
const app = express();
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');
const dotenv = require('dotenv');
const https = require('https');
const privateKey  = fs.readFileSync('ssl/host.key');
const certificate = fs.readFileSync('ssl/host.cert');

var credentials = {key: privateKey, cert: certificate};

// Load env
dotenv.config({ path: './config.env' });

// Connect to DB
const DB = process.env.DATABASE_URL.replace('<password>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {}).then(() => console.log('DB connection successful!'));

// Midelwares
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(fileUpload());
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/record', require('./routes/recordRoutes'));
app.use('/api/v1/sentence', require('./routes/sentenceRoutes'));

var httpsServer = https.createServer(credentials, app);

const PORT = process.env.PORT || 5000;

/*httpsServer.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
});*/
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
});


