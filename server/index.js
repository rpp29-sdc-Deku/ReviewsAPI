const path = require('path');
const express = require('express');
const expressStaticGzip = require('express-static-gzip');
// const api = require('./helpers/api.js');
const cors = require('cors');
require('dotenv').config();

// const db = require('../database/mongo.js');

const reviews = require('./routes/reviews.js');
const app = express();

// app.use(express.static(path.join(__dirname, '/../client/dist')));
// app.use('/', expressStaticGzip(path.join(__dirname, '/../client/dist'), {
//   enableBrotli: true
// }));

app.use(cors());
app.use('/atelier', reviews);

app.listen(4000);
console.log('Listening on port 4000');
