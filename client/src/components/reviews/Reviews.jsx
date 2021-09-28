import React from 'react';
import ListView from './ListView.jsx';
import Ratings from './Ratings.jsx';
import AddReview from './AddReview.jsx';
import debounce from 'lodash/debounce';
import interactions from '../../helpers/reviews/interactions.js';
/* eslint-disable react/prop-types */
class Reviews extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      reviewList: [],
      filterRatings: [],
      characteristics: [],
      ratings: {},
      recommended: {},
      sortBy: 'relevant',
      addReview: false,
      ratingsBreakdown: {},
      filterdSearch: ''
    };
    // function goes here for api call
  }

  sortList (event, sorting) {
    interactions('select');
    let sorted;
    let sortBy = '';
    const sort = sorting || event.target.value;
    if (sort === 'helpful' || sort === 'Helpful') {
      sortBy = 'helpful';
      sorted = this.state.reviewList.sort((a, b) => {
        return b.helpfulness - a.helpfulness;
      });
      this.setState({
        reviewList: sorted,
        sortBy: sortBy
      });
      return;
    }
    if (sort === 'newest' || sort === 'Newest') {
      sortBy = 'newest';
      sorted = this.state.reviewList.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      this.setState({
        reviewList: sorted,
        sortBy: sortBy
      });
      return;
    }
    if (sort === 'relevant' || sort === 'Relevance') {
      sortBy = 'relevant';
      sorted = this.state.reviewList.sort((a, b) => {
        if (a.helpfulness === b.helpfulness) {
          return new Date(b.date) - new Date(a.date);
        }
        return b.helpfulness - a.helpfulness;
      });
      this.setState({
        reviewList: sorted,
        sortBy: sortBy
      });
    }
  }

  removeFilterRatings (e) {
    e.preventDefault();
    this.setState({
      filterRatings: []
    });
    interactions('a')
  }

  filterRatings (rating) {
    console.log(rating);
    const filterRatings = this.state.filterRatings;
    if (filterRatings.indexOf(rating) === -1) {
      if (filterRatings.length < 5) {
        filterRatings.push(rating);
      } else {
        const index = filterRatings.indexOf(0);
        filterRatings[index] = rating;
      }
    } else {
      const index = filterRatings.indexOf(rating);
      filterRatings[index] = 0;
    }
    this.setState({
      filterRatings: filterRatings
    }, () => console.log(this.state.filterRatings));
    interactions('label');
  }

  addReview () {
    this.setState({
      addReview: !this.state.addReview
    }, () => {
      if(this.state.addReview === true) {
      interactions('button')
    }else {
      interactions('span')
    }
  });

  }

  newReviewAdded () {
    this.setState({
      newReviewAdded: true
    });
  }

  filterSearch = debounce((text) => {
    this.setState({
      filterdSearch: text.toLowerCase()
    })
    interactions('input')
  }, 1000)

  componentDidMount () {
    this.getProductDetails();
    // this.props.getReviews(this.props.product_id, this.state.sortBy, (results) => {
    //   this.setState({
    //     reviewList: results
    //   });
    //   this.props.getReviewLength(results.length);
    // });
    // this.props.getMeta(this.props.product_id, (results) => {
    //   const characteristics = [];
    //   let averageRating = 0;
    //   let num = 0;
    //   let den = 0;
    //   console.log('resultsss', results);
    //   for (const keys in results.characteristics) {
    //     const obj = {};
    //     obj[keys] = { value: results.characteristics[keys].value, id: results.characteristics[keys].id };
    //     characteristics.push(obj);
    //   };
    //   for (const keys in results.ratings) {
    //     num = (num + (keys * results.ratings[keys]));
    //     den += parseInt(results.ratings[keys]);
    //   }
    //   averageRating = num / den;
    //   this.props.setStars(averageRating);
    //   this.setState({
    //     characteristics: characteristics,
    //     ratings: results.ratings,
    //     recommended: results.recommended,
    //     ratingsBreakdown: results.ratings || {}
    //   });
    // });
  }

  getProductDetails () {
    console.log('GET request from reviews feature:', this.props.product_id, this.state.sortBy);
    this.props.getReviews(this.props.product_id, 'newest', (results) => {
      console.log('Reviews:', results);
      this.setState({
        reviewList: results
      });
      this.props.getReviewLength(results.length);
    });
    this.props.getMeta(this.props.product_id, (results) => {
      const characteristics = [];
      let averageRating = 0;
      let num = 0;
      let den = 0;
      console.log('resultsss', results);
      for (const keys in results.characteristics) {
        const obj = {};
        obj[keys] = { value: results.characteristics[keys].value, id: results.characteristics[keys].id };
        characteristics.push(obj);
      };
      for (const keys in results.ratings) {
        num = (num + (keys * results.ratings[keys]));
        den += parseInt(results.ratings[keys]);
      }
      averageRating = num / den;
      this.props.setStars(averageRating);
      this.setState({
        characteristics: characteristics,
        ratings: results.ratings,
        recommended: results.recommended,
        ratingsBreakdown: results.ratings || {}
      });
    });
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.product_id !== this.props.product_id) {
      this.getProductDetails();
      // this.props.getReviews(this.props.product_id, this.state.sortBy, (results) => {
      //   this.setState({
      //     reviewList: results
      //   });
      //   this.props.getReviewLength(results.length);
      // });
      // this.props.getMeta(this.props.product_id, (results) => {
      //   const characteristics = [];
      //   let averageRating = 0;
      //   let num = 0;
      //   let den = 0;
      //   console.log('resultsss', results);
      //   for (const keys in results.characteristics) {
      //     const obj = {};
      //     obj[keys] = { value: results.characteristics[keys].value, id: results.characteristics[keys].id };
      //     characteristics.push(obj);
      //   };
      //   for (const keys in results.ratings) {
      //     num = (num + (keys * results.ratings[keys]));
      //     den += parseInt(results.ratings[keys]);
      //   }
      //   averageRating = num / den;
      //   this.props.setStars(averageRating);
      //   this.setState({
      //     characteristics: characteristics,
      //     ratings: results.ratings,
      //     recommended: results.recommended,
      //     ratingsBreakdown: results.ratings || {}
      //   });
      // });
    }
  }

  render () {
    return (
        <div className='Reviews'>
          <h3>Ratings &#38; Reviews</h3>
          <div className='reviewFlex'>

          {this.state.reviewList.length > 0 && (<Ratings filterRatings={this.filterRatings.bind(this)} ratingsBreakdown={this.state.ratingsBreakdown} removeFilterRatings={this.removeFilterRatings.bind(this)} filtered={this.state.filterRatings} starValue={this.props.starsValue} characteristics={this.state.characteristics} recommended={this.state.recommended}/>)}
        <ListView filterdSearch={this.state.filterdSearch} filterSearch={this.filterSearch.bind(this)} filterRatings={this.state.filterRatings} reviewList={this.state.reviewList || []} sortBy={this.state.sortBy} sortList={this.sortList.bind(this)} addReview={this.addReview.bind(this)} />
        {this.state.addReview && <AddReview addReview={this.addReview.bind(this)} getProductDetails={this.getProductDetails.bind(this)} product_id={this.props.product_id} characteristics={this.state.characteristics}/>}
          </div>
        </div>
    );
  }
}

export default Reviews;
