create table bot
(
    id          int auto_increment
        primary key,
    user_id     int            not null,
    title       varchar(128)   not null,
    description varchar(356)   null,
    content     varchar(10000) null,
    create_time datetime       null,
    modify_time datetime       null,
    constraint id
        unique (id)
);

create table record
(
    id          int auto_increment
        primary key,
    a_id        int           null,
    a_sx        int           null,
    a_sy        int           null,
    b_id        int           null,
    b_sx        int           null,
    b_sy        int           null,
    a_steps     varchar(1000) null,
    b_steps     varchar(1000) null,
    map         varchar(1000) null,
    loser       varchar(10)   null,
    create_time datetime      null,
    constraint id
        unique (id)
);

create table user
(
    id       int auto_increment
        primary key,
    username varchar(128)     not null,
    password varchar(128)     not null,
    photo    varchar(1024)    null,
    rating   int default 1500 not null,
    constraint id
        unique (id)
);

