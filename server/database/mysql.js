const mysql = require('mysql');
// const { getColumns } = require('./etl.js');
// const checkWatch = require('../server/helpers/stopWatch.js');
const dbConfig = require('../../configDB.js');

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

module.exports = (query) => {
  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) {
        console.log(err.stack);
        reject(err);
      } else {
        console.log(results);
        resolve(results);
      }
    });
  });
};
