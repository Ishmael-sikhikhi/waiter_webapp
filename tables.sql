create table days (
	id serial not null primary key,
	day text not null
);

create table users (
	id serial not null primary key,
	name text not null
);

insert into days (day) values ('Sunday');
insert into days (day) values ('Monday');
insert into days (day) values ('Tuesday');
insert into days (day) values ('Wednesday');
insert into days (day) values ('Thursday');
insert into days (day) values ('Friday');
insert into days (day) values ('Saturday');

create table user_days (
	id serial not null primary key,
	days_id int not null,
	foreign key (days_id) references days(id),
	users_id int not null,
	foreign key (users_id) references users(id)
);
