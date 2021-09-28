// import $ from 'jquery';
import axios from 'axios';

const getReviews = (productId, sort, cb) => {
  axios.get(`/atelier/reviews?product_id=${productId}&sort=${sort}`)
    .then(res => {
      cb(res.data);
    })
    .catch(err => {
      console.log(err.stack);
    });
  // $.ajax({
  //   type: 'GET',
  //   url: '/atelier/reviews',
  //   data: { sort, productId },
  //   success: cb
  // });
};

export default getReviews;
