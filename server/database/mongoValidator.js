module.exports.validator = {
  $jsonSchema: {
    bsonType: 'object',
    title: 'productId',
    properties: {
      bsonType: 'array',
      title: 'reviews',
      items: {
        id: {
          bsonType: 'int'
        },
        rating: {
          bsonType: 'int'
        },
        date: {
          bsonType: 'timestamp'
        },
        summary: {
          bsonType: 'string'
        },
        body: {
          bsonType: 'string'
        },
        recommend: {
          bsonType: 'bool'
        },
        reported: {
          bsonType: 'bool'
        },
        reviewerName: {
          bsonType: 'string'
        },
        reviewerEmail: {
          bsonType: 'string'
        },
        response: {
          bsonType: 'string'
        },
        helpfulness: {
          bsonType: 'int'
        },
        photoURLs: {
          bsonType: 'array',
          items: {
            bsonType: 'string'
          }
        },
        characteristic_reviews: {
          bsonType: 'array',
          items: {
            bsonType: 'object',
            title: 'characteristic',
            properties: {
              name: {
                bsonType: 'string'
              },
              rating: {
                bsonType: 'int'
              }
            }
          }
        }
      }
    },
    required: [
      'productId',
      'rating',
      'date',
      'reviewerName',
      'reviewerEmail'
    ]
  }
};
