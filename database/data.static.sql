insert into data_sources (abbr, name, website) values
('USDA', 'United States Department of Agriculture', 'https://www.usda.gov/'),
('ODPHP', 'Office of Disease Prevention and Health Promotion', 'https://health.gov/'),
(null, 'The National Academies of Sciences, Engineering, and Medicine', 'http://www.nationalacademies.org/'),
(null, 'Wikipedia', 'https://en.wikipedia.org/'),
('User', 'Information manually entered by a user', null);

insert into nutrient_categories (name) values
('Vitamins'),
('Minerals'),
('Fats'),
('Proteins'),
('Carbohydrates'),
('Other');

insert into nf_dd_categories (name, servings) values
('Beans', 3),
('Berries', 1),
('Other Fruits', 3),
('Cruciferous Vegetables', 1),
('Greens', 2),
('Other Vegetables', 2),
('Flaxseeds', 1),
('Nuts and Seeds', 1),
('Herbs and Spices', 1),
('Whole Grains', 3),
('Beverages', 5);

insert into units (abbr, name) values
('kcal', 'kilocalories'),
('kJ', 'kilojoules'),
('mg', 'milligrams'),
('g', 'grams'),
('µg', 'micrograms'),
('IU', 'International Units');

insert into meal_types (name) values
('Breakfast'),
('Brunch'),
('Lunch'),
('Dinner'),
('Snack');

insert into food_label_definitions (name) values
('Vegan'),
('Whole food');

insert into user_types (name) values
('Regular user'),
('Nutritionist'),
('Medical doctor'),
('Health professional'),
('Personal trainer'),
('Professional cook'),
('Restaurant owner'),
('Business owner'),
('Other');
