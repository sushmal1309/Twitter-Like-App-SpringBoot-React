create database user_db;
use user_db;
create table user(
    user_id bigint primary key auto_increment,
    first_name varchar(100) not null,
    last_name varchar(100),
    email_id varchar(255) unique not null,	
    date_of_birth date not null,
    password varchar(255) not null,
    joined_date date not null,
    bio varchar(255),
    location varchar(100),
    website varchar(255),
    profile_picture TEXT,
    cover_photo TEXT,
    is_location_enabled enum('TRUE','FALSE')
);