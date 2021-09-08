const path = require('path');
const express = require('express');
const expressStaticGzip = require('express-static-gzip');
// const api = require('./helpers/api.js');
const cors = require('cors');
require('dotenv').config();

// const db = require('../database/mongo.js');

const productOverview = require('./routes/product_overview.js');
const questionsAnswers = require('./routes/questions_answers.js');
const relatedProducts = require('./routes/related_products.js');
const reviews = require('./routes/reviews.js');
const app = express();

// app.use(express.static(path.join(__dirname, '/../client/dist')));
app.use('/', expressStaticGzip(path.join(__dirname, '/../client/dist'), {
  enableBrotli: true
}));

app.use(cors());

app.listen(4000);

app.use('/atelier', productOverview);
app.use('/atelier', questionsAnswers);
app.use('/atelier', relatedProducts);
app.use('/atelier', reviews);
