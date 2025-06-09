drop database if exists userbase;
create database userbase;
use userbase;

create table user
(
    username    varchar(30) not null,
    pass    varchar(255) not null,
    constraint  user_PK primary key (username)
);