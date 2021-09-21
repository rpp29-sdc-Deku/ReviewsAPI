// const { test, expect } = require('jest');
const reviewsHelpers = require('../helpers/reviews_helpers.js');

jest.setTimeout(10000);

test('Returns reviews for the product with an id of 2 from the MySQL DB', () => {
  return reviewsHelpers.getReviews({ product_id: 2 })
    .then(response => {
      console.log(response);
      expect(response.length).toBe(5);
    });
});

test('Counts rows in the "reviews" table of the MySQL DB', () => {
  return reviewsHelpers.fwdQuery('select count(*) from reviews')
    .then(response => {
      const rowCount = response[0]['count(*)'];
      expect(rowCount).toBe(5774952);
    });
});
