const mysql = require('mysql');
const { getColumns } = require('./etl.js');
const checkWatch = require('../server/helpers/stopWatch.js');
const dbConfig = require('../configDB.js');
const path = require('path');

// const etlSourceFile = path.resolve('../dataDump/reviews.csv');
// const dbTable = 'reviews';
const etlSources = {
  // reviews: '../dataDump/reviews.csv',
  characteristics: '../dataDump/characteristics.csv',
  characteristic_ratings: '../dataDump/characteristic_reviews.csv',
  photos: '../dataDump/reviews_photos.csv'
};

const db = mysql.createConnection(dbConfig);

db.connect(err => {
  if (err) {
    console.log(`Cannot connect to ${dbConfig.database} as ${dbConfig.user}`);
  }

  console.log(`Connected to ${dbConfig.database} as ${dbConfig.user}`);
});

// const insertClosure = () => {
//   let columns = '';

//   return (row) => {
//     if (columns.length) {
//       db.query(`LOAD DATA INFILE ${etlSourceFile} INTO TABLE reviews IGNORE 1 ROWS (${[columns]})`, (err, results, rows) => {
//         // db.query(`INSERT IGNORE INTO reviews (${columns}) VALUES (?);`, [row], (err, results, rows) => {
//         if (err) {
//           console.log(err);
//         }
//       });
//     } else {
//       if (row.length) {
//         columns = row.join(', ');
//         console.log(columns);
//       }
//     }
//   };
// };

// const insertCallback = insertClosure();
const checkWatch = stopwatch();

for (const table in etlSources) {
  const etlSourceFile = path.resolve(etlSources[table]);
  getColumns(etlSourceFile, columns => {
    db.query('LOAD DATA LOCAL INFILE "' + etlSourceFile +
      `" INTO TABLE ${table} ` +
      'FIELDS TERMINATED BY "," ' +
      'ENCLOSED BY \'"\' ' +
      'LINES TERMINATED BY \'\n\' ' +
      'IGNORE 1 ROWS ' +
      `(${[columns]});`, (err, results) => {
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

module.exports = db;
