const path = require('path');
const express = require('express');
const expressStaticGzip = require('express-static-gzip');
const api = require('./helpers/api.js');
const cors = require('cors');
require('dotenv').config();

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

app.all('*', (req, res) => (
  api.fwd(req, (err, result) => {
    console.log('API response:');
    if (err) {
      const error = (err.response ? err.response.data : err) + '\n';
      console.log(error);
      res.sendStatus(500);
    } else {
      if (Array.isArray(result)) {
        console.log(result.map(result => (JSON.stringify(result))));
        res.json(result);
      } else {
        console.log(result);
        res.send(result);
      }
    }
    res.end();
  })
));
