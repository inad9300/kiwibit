-- Categories from the NutritionFacts.org's Daily Dozen list.
create table nf_dd_categories (
    id serial primary key,
    name varchar(30) not null unique check (length(name) > 0),
    servings smallint not null check (servings > 0 and servings <= 5)
);

create table usda_categories (
    id serial primary key,
    usda_id char(5) not null unique,
    is_visible_default bool not null,
    color char(7) not null check (color ~ '#[0-9a-f]{6}'),

    foreign key (usda_id) references usda.fd_group(fdgrp_cd)
);

create table data_sources (
    id serial primary key,
    name varchar(70) not null unique check (length(name) > 0),
    abbr varchar(10) unique check (abbr is null or length(abbr) > 0)
);

create table units (
    id serial primary key,
    abbr varchar(30) not null unique check (length(abbr) > 0),
    name varchar(30) not null unique check (length(name) > 0)
);

create table food_label_definitions (
    id serial primary key,
    name varchar(30) not null unique check (length(name) > 0)
);

create table user_types (
    id serial primary key,
    name varchar(30) not null unique check (length(name) > 0)
);

create table users (
    id serial primary key,
    name varchar(40) not null check (char_length(name) >= 2),
    email varchar(250) not null unique check (char_length(email) >= 6),
    password varchar(250) not null check (char_length(password) >= 8),
    age smallint check (age >= 0 and age <= 150),
    gender char(1) check (gender in ('M', 'F')),
    is_public bool not null default false,
    user_type_id int not null,
    is_pregnant bool not null default false,
    is_lactating bool not null default false,
    activity_level smallint not null default 1 check (activity_level >= 1 and activity_level <= 5),
    weight_kg smallint check (weight_kg >= 2 and weight_kg <= 500),
    height_cm smallint check (height_cm >= 40 and height_cm <= 250),

    foreign key (user_type_id) references user_types(id),
    check (is_pregnant = false or gender = 'F'),
    check (is_lactating = false or gender = 'F')
);

create table foods (
    id serial primary key,
    name varchar(140) not null unique check (length(name) > 0),

    -- TODO Review.
    source_id int not null,
    source_usda_id char(5),
    source_user_id int,

    usda_category_id int not null,
    nf_dd_category_id int,

    foreign key (source_id) references data_sources(id),
    foreign key (source_usda_id) references usda.food_des(ndb_no),
    foreign key (source_user_id) references users(id),
    check (
        (case when source_usda_id is null then 0 else 1 end) +
        (case when source_user_id is null then 0 else 1 end) = 1
    ),

    foreign key (usda_category_id) references usda_categories(id),
    foreign key (nf_dd_category_id) references nf_dd_categories(id)
);

create table food_labels (
    food_id int not null,
    label_id int not null,

    foreign key (food_id) references foods(id),
    foreign key (label_id) references food_label_definitions(id)
);

-- create function check_foods_source_id_consistency() return trigger as
-- $body$
-- begin
--     if new.source_usda_id is not null then
--         -- new.source_id
--         null;
--     else if new.source_user_id is not null then
--         null;
--     end if;
-- end;
-- $body$

create table nutrients (
    id serial primary key,
    name varchar(40) not null unique check (length(name) > 0),
    unit_id int not null,
    is_essential bool not null,
    is_visible_default bool not null,

    source_id int not null,
    source_usda_id char(5),

    foreign key (unit_id) references units(id),
    foreign key (source_id) references data_sources(id),
    foreign key (source_usda_id) references usda.nutr_def(nutr_no)
);

create table nutrient_categories (
    id serial primary key,
    name varchar(40) not null unique check (length(name) > 0)
);

create table food_nutrients (
    food_id int not null,
    nutrient_id int not null,
    amount smallint not null,

    foreign key (food_id) references foods(id),
    foreign key (nutrient_id) references nutrients(id)
);

create table files (
    id serial primary key,
    name varchar(500) not null check (length(name) > 0),
    type varchar(100) not null check (length(type) > 0),
    data bytea not null
);

create table recipes (
    id serial primary key,
    description varchar(50000),
    user_id int not null,
    is_public bool not null default false,
    main_photo bytea,
    estimated_time_min smallint,
    estimated_difficulty varchar(10) check (estimated_difficulty in ('easy', 'medium', 'hard')),

    foreign key (user_id) references users(id),
    check (is_public = false or main_photo is not null)
);

create table recipe_ingredients (
    recipe_id int not null,
    food_id int not null,
    amount_g smallint not null,

    foreign key (recipe_id) references recipes(id),
    foreign key (food_id) references foods(id)
);

create table cup_gram_ratios (
    food_id int not null,
    cups smallint not null,
    grams smallint not null,

    foreign key (food_id) references foods(id)
);

create table meal_types (
    id serial primary key,
    name varchar(30) not null unique check (length(name) > 0)
);

create table user_daily_foods (
    user_id int not null,
    food_id int not null,
    date date not null check (date >= '2000-01-01' and date <= current_date + interval '1 year'),
    meal_type_id int not null,
    amount_g smallint not null check (amount_g > 0 and amount_g < 3000),

    foreign key (user_id) references users(id),
    foreign key (food_id) references foods(id),
    foreign key (meal_type_id) references meal_types(id),

    unique (user_id, food_id, date, meal_type_id)
);

create table user_daily_recipes (
    user_id int not null,
    recipe_id int not null,
    date date not null check (date >= '2000-01-01' and date <= current_date + interval '1 year'),
    meal_type_id int not null,
    amount_g smallint not null check (amount_g > 0 and amount_g < 3000),

    foreign key (user_id) references users(id),
    foreign key (recipe_id) references recipes(id),
    foreign key (meal_type_id) references meal_types(id),

    unique (user_id, recipe_id, date, meal_type_id)
);

create table reference_intakes (
    source_id int not null,
    nutrient_id int not null,
    age_min smallint not null check (age_min >= 0 and age_min <= 150),
    age_max smallint not null check (age_max >= 0 and age_max <= 150),
    gender char(1) not null check (gender in ('M', 'F')),
    for_pregnancy bool not null,
    for_lactation bool not null,
    value float not null,

    primary key (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation),
    foreign key (source_id) references data_sources(id),
    foreign key (nutrient_id) references nutrients(id),
    check (age_min < age_max),
    check (for_pregnancy = false or gender = 'F'),
    check (for_lactation = false or gender = 'F')
);

create table tolerable_intakes (
    source_id int not null,
    nutrient_id int not null,
    age_min smallint not null check (age_min >= 0 and age_min <= 150),
    age_max smallint not null check (age_max >= 0 and age_max <= 150),
    gender char(1) not null check (gender in ('M', 'F')),
    for_pregnancy bool not null,
    for_lactation bool not null,
    value float not null,

    primary key (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation),
    foreign key (source_id) references data_sources(id),
    foreign key (nutrient_id) references nutrients(id),
    check (age_min < age_max),
    check (for_pregnancy = false or gender = 'F'),
    check (for_lactation = false or gender = 'F')
);
