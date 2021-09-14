const path = require('path');
const fs = require('fs');
const readline = require('readline');
// const db = require('./mysql.js');
const checkWatch = require('../helpers/stopWatch.js');

const etlSources = {
  reviews: './dataDump/reviews.csv',
  characteristics: './dataDump/characteristics.csv',
  characteristic_ratings: './dataDump/characteristic_reviews.csv',
  photos: './dataDump/reviews_photos.csv'
};

const getColNames = (sourceFile, insertCallback, exit) => {
  const rd = readline.createInterface({
    input: fs.createReadStream(sourceFile),
    // output: process.stdout,
    console: false
  });

  let rows = 0;
  const start = Date.now();

  rd.on('line', line => {
    insertCallback(rows++ ? JSON.parse('[' + line + ']') : line.split(','));
  });

  rd.on('close', () => {
    const time = Date.now() - start;
    const message = time > 1000 ? time + ' seconds' : time + 'ms';
    console.log(`Duration: ${message}`);
    exit(rows);
  });
};

const etl = (db) => {
  for (const table in etlSources) {
    const etlSourceFile = path.resolve(etlSources[table]);
    getColNames(etlSourceFile, colNames => {
      db.query('LOAD DATA LOCAL INFILE "' + etlSourceFile +
        `" INTO TABLE ${table} ` +
        'FIELDS TERMINATED BY "," ' +
        'ENCLOSED BY \'"\' ' +
        'LINES TERMINATED BY \'\n\' ' +
        'IGNORE 1 ROWS ' +
        `(${[colNames]});`, (err, results) => {
        // db.query(`INSERT IGNORE INTO reviews (${columns}) VALUES (?);`, [row], (err, results, rows) => {
        if (err) {
          console.log(err);
        } else {
          const time = checkWatch();
          console.log(results, `${table}: ${time.display.lap} (total: ${time.display.total}`);
        }
      });
    });
  }
};

module.exports = { etl, getColNames };
