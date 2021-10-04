create table days (
	id serial not null primary key,
	day text not null
);

create table users (
	id serial not null primary key,
	name text not null,
	days_id int not null,
	foreign key (days_id) references days(id)
);

insert into days (day) values ('Sunday');
insert into days (day) values ('Monday');q
insert into days (day) values ('Tuesday');
insert into days (day) values ('Wednesday');
insert into days (day) values ('Thursday');
insert into days (day) values ('Friday');
insert into days (day) values ('Saturday');
