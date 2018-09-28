create table users (
    id serial primary key,
    name char(50) not null,
    email char(250) not null,
    pwd char(250) not null,
    age int,
    gender char(1),
    pregnancy char(1) default 'N',
    lactation char(1) default 'N',
    activity_lvl int default 0,
    weight int, -- kg
    height int, -- cm

    constraint chk_users_name_min check (char_length(name) >= 2),
    constraint uk_users_email unique (email),
    constraint chk_users_email_min check (char_length(email) >= 6),
    constraint chk_users_pwd check (char_length(pwd) > 8),
    constraint chk_users_age check (age >= 0 and age <= 150),
    constraint chk_users_gender check (gender in ('M', 'F')),
    constraint chk_users_pregnancy check (pregnancy in ('Y', 'N')),
    constraint chk_users_lactation check (lactation in ('Y', 'N')),
    constraint chk_users_pregnancy_women check (pregnancy = 'N' or (pregnancy = 'Y' and gender = 'F')),
    constraint chk_users_lactation_women check (lactation = 'N' or (lactation = 'Y' and gender = 'F')),
    constraint chk_users_activity_lvl check (activity_lvl >= 0 and activity_lvl <= 4),
    constraint chk_users_weight check (weight >= 2 and weight <= 500),
    constraint chk_users_height check (height >= 50 and height <= 250)
);

create table meals (
    id serial primary key,
    NDB_No char(5) not null,
    user_id int not null,
    date date not null,
    type char(10),
    qty int not null, -- g
    eaten bool not null default false,
    dorder int not null,
    settled bool null,

    constraint fk_meals_ndbno foreign key (NDB_No) references food_des(NDB_No),
    constraint fk_meals_user_id foreign key (user_id) references users(id),
    constraint uk_meals unique (NDB_No, user_id, date, dorder, settled),
    constraint chk_meals_date check (date >= '2000-01-01' and date <= current_date + interval '1 year'),
    constraint chk_meals_type check (type in ('Breakfast', 'Brunch', 'Lunch', 'Dinner', 'Snack')),
    constraint chk_meals_qty check (qty > 0 and qty <= 3000),
    constraint chk_meals_eaten check (eaten = false or (eaten = true and date <= current_date)),
    constraint chk_meals_dorder check (dorder >= 0 and dorder <= 200)
);
