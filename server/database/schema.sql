CREATE DATABASE dekuReviews;

USE dekuReviews;

CREATE TABLE reviews (
  id int not null auto_increment,
  product_id int,
  rating int not null, /* Inner join here? Cache other reviews with the same rating? */
  date bigint not null,
  summary varchar(240),
  body text,
  recommend boolean,
  reported boolean,
  reviewer_name varchar(64) not null, /* Inner join here? Collect other reviews by same reviewer and cache on server? */
  reviewer_email varchar(64) not null,
  response text,
  helpfulness int,
  primary key (id)
);

CREATE TABLE ratings (
  id int not null auto_increment,
  product_id int not null,
  index product_index (product_id),
  rating int,
  primary key (id)
);

CREATE TABLE characteristics (
  id int not null auto_increment,
  product_id int not null,
  index chr_index (product_id),
  name varchar(64) not null,
  primary key (id)
);

CREATE TABLE characteristic_ratings (
  id int not null auto_increment,
  characteristic_id int not null,
  index chr_rating_index (characteristic_id),
  foreign key (characteristic_id)
    references characteristics(id)
    on delete cascade,
  review_id int not null,
  index review_index (review_id),
  foreign key (review_id)
    references reviews(id)
    on delete cascade,
  value int not null,
  primary key (id)
);

CREATE TABLE photos (
  id int not null auto_increment,
  review_id int not null,
  index photo_index (review_id),
  foreign key (review_id)
    references reviews(id)
    on delete cascade,
  url text not null,
  primary key (id)
);

/* mysql -u root -p < schema.sql */
