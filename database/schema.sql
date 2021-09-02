CREATE DATABASE dekuReviews;

USE dekuReviews;

CREATE TABLE reviews (
  id int not null auto_increment,
  product_id int not null,
  rating int not null, /* Inner join here? Cache other reviews with the same rating? */
  date int not null,
  summary varchar(240),
  body text,
  recommend boolean,
  reported boolean,
  reviewer_name varchar(64) not null, /* Inner join here? Collect other reviews by same reviewer and cache on server? */
  reviewer_email varchar(64) not null,
  response text,
  helpfulness int,
  primary key (product_id)
);

CREATE TABLE ratings (
  id int not null auto_increment,
  product_id int not null,
  rating int,
  primary key (product_id)
);

CREATE TABLE characteristics (
  id: int not null auto_increment,
  product_id: int not null,
  name varchar(64) not null,
  primary key (product_id)
);

CREATE TABLE characteristic_ratings (
  id int not null auto_increment,
  characteristic_id int not null,
  review_id int not null,
  value int not null,
  primary key (review_id)
)

CREATE TABLE photos (
  id int not null auto_increment,
  review_id int not null,
  url text not null,
  primary key (review_id)
);

/* mysql -u root -p < server/schema.sql */
