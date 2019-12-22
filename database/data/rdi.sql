insert into data_sources (short_title, title, url)
values ('USA''s Dietary Guidelines', '2015-2020 Dietary Guidelines for Americans, Table A7-1', 'https://health.gov/dietaryguidelines/2015/resources/2015-2020_Dietary_Guidelines.pdf');

insert into reference_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Energy'), 1, 3, 'F', false, false, 1000),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Energy'), 1, 3, 'M', false, false, 1000),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Energy'), 4, 8, 'F', false, false, 1200),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Energy'), 4, 8, 'M', false, false, 1400),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Energy'), 9, 13, 'F', false, false, 1600),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Energy'), 9, 13, 'M', false, false, 1800),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Energy'), 14, 18, 'F', false, false, 1800),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Energy'), 14, 18, 'M', false, false, 2200),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Energy'), 19, 30, 'F', false, false, 2000),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Energy'), 19, 30, 'M', false, false, 2400),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Energy'), 31, 50, 'F', false, false, 1800),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Energy'), 31, 50, 'M', false, false, 2200),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Energy'), 51, 150, 'F', false, false, 1600),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Energy'), 51, 150, 'M', false, false, 2000);

insert into reference_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Protein'), 1, 3, 'F', false, false, 13),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Protein'), 1, 3, 'M', false, false, 13),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Protein'), 4, 8, 'F', false, false, 19),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Protein'), 4, 8, 'M', false, false, 19),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Protein'), 9, 13, 'F', false, false, 34),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Protein'), 9, 13, 'M', false, false, 34),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Protein'), 14, 18, 'F', false, false, 46),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Protein'), 14, 18, 'M', false, false, 52),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Protein'), 19, 30, 'F', false, false, 46),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Protein'), 19, 30, 'M', false, false, 56),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Protein'), 31, 50, 'F', false, false, 46),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Protein'), 31, 50, 'M', false, false, 56),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Protein'), 51, 150, 'F', false, false, 46),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Protein'), 51, 150, 'M', false, false, 56);

insert into reference_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Carbohydrates'), 1, 150, 'F', false, false, 130),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Carbohydrates'), 1, 150, 'M', false, false, 130);

insert into reference_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Fiber, total dietary'), 1, 3, 'F', false, false, 14),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Fiber, total dietary'), 1, 3, 'M', false, false, 14),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Fiber, total dietary'), 4, 8, 'F', false, false, 16.8),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Fiber, total dietary'), 4, 8, 'M', false, false, 19.6),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Fiber, total dietary'), 9, 13, 'F', false, false, 22.4),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Fiber, total dietary'), 9, 13, 'M', false, false, 25.2),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Fiber, total dietary'), 14, 18, 'F', false, false, 25.2),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Fiber, total dietary'), 14, 18, 'M', false, false, 30.8),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Fiber, total dietary'), 19, 30, 'F', false, false, 28),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Fiber, total dietary'), 19, 30, 'M', false, false, 33.6),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Fiber, total dietary'), 31, 50, 'F', false, false, 25.2),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Fiber, total dietary'), 31, 50, 'M', false, false, 30.8),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Fiber, total dietary'), 51, 150, 'F', false, false, 22.4),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Fiber, total dietary'), 51, 150, 'M', false, false, 28);

insert into reference_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Calcium'), 1, 3, 'F', false, false, 700),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Calcium'), 1, 3, 'M', false, false, 700),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Calcium'), 4, 8, 'F', false, false, 1000),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Calcium'), 4, 8, 'M', false, false, 1000),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Calcium'), 9, 13, 'F', false, false, 1300),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Calcium'), 9, 13, 'M', false, false, 1300),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Calcium'), 14, 18, 'F', false, false, 1300),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Calcium'), 14, 18, 'M', false, false, 1300),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Calcium'), 19, 30, 'F', false, false, 1000),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Calcium'), 19, 30, 'M', false, false, 1000),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Calcium'), 31, 50, 'F', false, false, 1000),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Calcium'), 31, 50, 'M', false, false, 1000),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Calcium'), 51, 150, 'F', false, false, 1200),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Calcium'), 51, 70, 'M', false, false, 1000),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Calcium'), 71, 150, 'M', false, false, 1200);

insert into reference_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Iron'), 1, 3, 'F', false, false, 7),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Iron'), 1, 3, 'M', false, false, 7),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Iron'), 4, 8, 'F', false, false, 10),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Iron'), 4, 8, 'M', false, false, 10),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Iron'), 9, 13, 'F', false, false, 8),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Iron'), 9, 13, 'M', false, false, 8),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Iron'), 14, 18, 'F', false, false, 15),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Iron'), 14, 18, 'M', false, false, 11),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Iron'), 19, 30, 'F', false, false, 18),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Iron'), 19, 30, 'M', false, false, 8),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Iron'), 31, 50, 'F', false, false, 18),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Iron'), 31, 50, 'M', false, false, 8),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Iron'), 51, 150, 'F', false, false, 8),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Iron'), 51, 150, 'M', false, false, 8);

insert into reference_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Magnesium'), 1, 3, 'F', false, false, 80),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Magnesium'), 1, 3, 'M', false, false, 80),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Magnesium'), 4, 8, 'F', false, false, 130),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Magnesium'), 4, 8, 'M', false, false, 130),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Magnesium'), 9, 13, 'F', false, false, 240),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Magnesium'), 9, 13, 'M', false, false, 240),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Magnesium'), 14, 18, 'F', false, false, 360),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Magnesium'), 14, 18, 'M', false, false, 410),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Magnesium'), 19, 30, 'F', false, false, 310),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Magnesium'), 19, 30, 'M', false, false, 400),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Magnesium'), 31, 50, 'F', false, false, 320),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Magnesium'), 31, 50, 'M', false, false, 420),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Magnesium'), 51, 150, 'F', false, false, 320),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Magnesium'), 51, 150, 'M', false, false, 420);

insert into reference_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Phosphorus'), 1, 3, 'F', false, false, 460),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Phosphorus'), 1, 3, 'M', false, false, 460),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Phosphorus'), 4, 8, 'F', false, false, 500),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Phosphorus'), 4, 8, 'M', false, false, 500),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Phosphorus'), 9, 13, 'F', false, false, 1250),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Phosphorus'), 9, 13, 'M', false, false, 1250),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Phosphorus'), 14, 18, 'F', false, false, 1250),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Phosphorus'), 14, 18, 'M', false, false, 1250),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Phosphorus'), 19, 30, 'F', false, false, 700),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Phosphorus'), 19, 30, 'M', false, false, 700),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Phosphorus'), 31, 50, 'F', false, false, 700),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Phosphorus'), 31, 50, 'M', false, false, 700),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Phosphorus'), 51, 150, 'F', false, false, 700),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Phosphorus'), 51, 150, 'M', false, false, 700);

insert into reference_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Potassium'), 1, 3, 'F', false, false, 3000),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Potassium'), 1, 3, 'M', false, false, 3000),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Potassium'), 4, 8, 'F', false, false, 3800),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Potassium'), 4, 8, 'M', false, false, 3800),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Potassium'), 9, 13, 'F', false, false, 4500),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Potassium'), 9, 13, 'M', false, false, 4500),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Potassium'), 14, 18, 'F', false, false, 4700),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Potassium'), 14, 18, 'M', false, false, 4700),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Potassium'), 19, 30, 'F', false, false, 4700),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Potassium'), 19, 30, 'M', false, false, 4700),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Potassium'), 31, 50, 'F', false, false, 4700),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Potassium'), 31, 50, 'M', false, false, 4700),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Potassium'), 51, 150, 'F', false, false, 4700),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Potassium'), 51, 150, 'M', false, false, 4700);

insert into reference_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Zinc'), 1, 3, 'F', false, false, 3),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Zinc'), 1, 3, 'M', false, false, 3),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Zinc'), 4, 8, 'F', false, false, 5),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Zinc'), 4, 8, 'M', false, false, 5),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Zinc'), 9, 13, 'F', false, false, 8),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Zinc'), 9, 13, 'M', false, false, 8),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Zinc'), 14, 18, 'F', false, false, 9),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Zinc'), 14, 18, 'M', false, false, 11),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Zinc'), 19, 30, 'F', false, false, 8),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Zinc'), 19, 30, 'M', false, false, 11),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Zinc'), 31, 50, 'F', false, false, 8),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Zinc'), 31, 50, 'M', false, false, 11),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Zinc'), 51, 150, 'F', false, false, 8),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Zinc'), 51, 150, 'M', false, false, 11);

insert into reference_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Copper'), 1, 3, 'F', false, false, 0.34),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Copper'), 1, 3, 'M', false, false, 0.34),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Copper'), 4, 8, 'F', false, false, 0.44),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Copper'), 4, 8, 'M', false, false, 0.44),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Copper'), 9, 13, 'F', false, false, 0.7),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Copper'), 9, 13, 'M', false, false, 0.7),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Copper'), 14, 18, 'F', false, false, 0.89),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Copper'), 14, 18, 'M', false, false, 0.89),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Copper'), 19, 30, 'F', false, false, 0.9),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Copper'), 19, 30, 'M', false, false, 0.9),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Copper'), 31, 50, 'F', false, false, 0.9),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Copper'), 31, 50, 'M', false, false, 0.9),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Copper'), 51, 150, 'F', false, false, 0.9),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Copper'), 51, 150, 'M', false, false, 0.9);

insert into reference_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Manganese'), 1, 3, 'F', false, false, 1.2),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Manganese'), 1, 3, 'M', false, false, 1.2),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Manganese'), 4, 8, 'F', false, false, 1.5),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Manganese'), 4, 8, 'M', false, false, 1.5),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Manganese'), 9, 13, 'F', false, false, 1.6),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Manganese'), 9, 13, 'M', false, false, 1.9),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Manganese'), 14, 18, 'F', false, false, 1.6),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Manganese'), 14, 18, 'M', false, false, 2.2),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Manganese'), 19, 30, 'F', false, false, 1.8),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Manganese'), 19, 30, 'M', false, false, 2.3),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Manganese'), 31, 50, 'F', false, false, 1.8),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Manganese'), 31, 50, 'M', false, false, 2.3),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Manganese'), 51, 150, 'F', false, false, 1.8),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Manganese'), 51, 150, 'M', false, false, 2.3);

insert into reference_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Selenium'), 1, 3, 'F', false, false, 20),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Selenium'), 1, 3, 'M', false, false, 20),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Selenium'), 4, 8, 'F', false, false, 30),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Selenium'), 4, 8, 'M', false, false, 30),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Selenium'), 9, 13, 'F', false, false, 40),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Selenium'), 9, 13, 'M', false, false, 40),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Selenium'), 14, 18, 'F', false, false, 55),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Selenium'), 14, 18, 'M', false, false, 55),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Selenium'), 19, 30, 'F', false, false, 55),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Selenium'), 19, 30, 'M', false, false, 55),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Selenium'), 31, 50, 'F', false, false, 55),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Selenium'), 31, 50, 'M', false, false, 55),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Selenium'), 51, 150, 'F', false, false, 55),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Selenium'), 51, 150, 'M', false, false, 55);

insert into reference_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin A, RAE'), 1, 3, 'F', false, false, 300),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin A, RAE'), 1, 3, 'M', false, false, 300),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin A, RAE'), 4, 8, 'F', false, false, 400),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin A, RAE'), 4, 8, 'M', false, false, 400),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin A, RAE'), 9, 13, 'F', false, false, 600),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin A, RAE'), 9, 13, 'M', false, false, 600),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin A, RAE'), 14, 18, 'F', false, false, 700),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin A, RAE'), 14, 18, 'M', false, false, 900),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin A, RAE'), 19, 30, 'F', false, false, 700),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin A, RAE'), 19, 30, 'M', false, false, 900),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin A, RAE'), 31, 50, 'F', false, false, 700),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin A, RAE'), 31, 50, 'M', false, false, 900),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin A, RAE'), 51, 150, 'F', false, false, 700),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin A, RAE'), 51, 150, 'M', false, false, 900);

insert into reference_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin E'), 1, 3, 'F', false, false, 6),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin E'), 1, 3, 'M', false, false, 6),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin E'), 4, 8, 'F', false, false, 7),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin E'), 4, 8, 'M', false, false, 7),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin E'), 9, 13, 'F', false, false, 11),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin E'), 9, 13, 'M', false, false, 11),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin E'), 14, 18, 'F', false, false, 15),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin E'), 14, 18, 'M', false, false, 15),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin E'), 19, 30, 'F', false, false, 15),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin E'), 19, 30, 'M', false, false, 15),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin E'), 31, 50, 'F', false, false, 15),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin E'), 31, 50, 'M', false, false, 15),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin E'), 51, 150, 'F', false, false, 15),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin E'), 51, 150, 'M', false, false, 15);

insert into reference_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin D'), 1, 70, 'F', false, false, 600),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin D'), 1, 70, 'M', false, false, 600),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin D'), 71, 150, 'F', false, false, 800),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin D'), 71, 150, 'M', false, false, 800);

insert into reference_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin C'), 1, 3, 'F', false, false, 15),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin C'), 1, 3, 'M', false, false, 15),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin C'), 4, 8, 'F', false, false, 25),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin C'), 4, 8, 'M', false, false, 25),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin C'), 9, 13, 'F', false, false, 45),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin C'), 9, 13, 'M', false, false, 45),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin C'), 14, 18, 'F', false, false, 65),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin C'), 14, 18, 'M', false, false, 75),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin C'), 19, 30, 'F', false, false, 75),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin C'), 19, 30, 'M', false, false, 90),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin C'), 31, 50, 'F', false, false, 75),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin C'), 31, 50, 'M', false, false, 90),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin C'), 51, 150, 'F', false, false, 75),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin C'), 51, 150, 'M', false, false, 90);

insert into reference_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B1'), 1, 3, 'F', false, false, 0.5),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B1'), 1, 3, 'M', false, false, 0.5),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B1'), 4, 8, 'F', false, false, 0.6),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B1'), 4, 8, 'M', false, false, 0.6),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B1'), 9, 13, 'F', false, false, 0.9),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B1'), 9, 13, 'M', false, false, 0.9),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B1'), 14, 18, 'F', false, false, 1),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B1'), 14, 18, 'M', false, false, 1.2),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B1'), 19, 30, 'F', false, false, 1.1),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B1'), 19, 30, 'M', false, false, 1.2),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B1'), 31, 50, 'F', false, false, 1.1),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B1'), 31, 50, 'M', false, false, 1.2),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B1'), 51, 150, 'F', false, false, 1.1),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B1'), 51, 150, 'M', false, false, 1.2);

insert into reference_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B2'), 1, 3, 'F', false, false, 0.5),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B2'), 1, 3, 'M', false, false, 0.5),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B2'), 4, 8, 'F', false, false, 0.6),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B2'), 4, 8, 'M', false, false, 0.6),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B2'), 9, 13, 'F', false, false, 0.9),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B2'), 9, 13, 'M', false, false, 0.9),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B2'), 14, 18, 'F', false, false, 1),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B2'), 14, 18, 'M', false, false, 1.3),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B2'), 19, 30, 'F', false, false, 1.1),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B2'), 19, 30, 'M', false, false, 1.3),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B2'), 31, 50, 'F', false, false, 1.1),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B2'), 31, 50, 'M', false, false, 1.3),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B2'), 51, 150, 'F', false, false, 1.1),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B2'), 51, 150, 'M', false, false, 1.3);

insert into reference_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B3'), 1, 3, 'F', false, false, 6),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B3'), 1, 3, 'M', false, false, 6),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B3'), 4, 8, 'F', false, false, 8),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B3'), 4, 8, 'M', false, false, 8),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B3'), 9, 13, 'F', false, false, 12),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B3'), 9, 13, 'M', false, false, 12),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B3'), 14, 18, 'F', false, false, 14),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B3'), 14, 18, 'M', false, false, 16),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B3'), 19, 30, 'F', false, false, 14),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B3'), 19, 30, 'M', false, false, 16),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B3'), 31, 50, 'F', false, false, 14),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B3'), 31, 50, 'M', false, false, 16),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B3'), 51, 150, 'F', false, false, 14),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B3'), 51, 150, 'M', false, false, 16);

insert into reference_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B6'), 1, 3, 'F', false, false, 0.5),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B6'), 1, 3, 'M', false, false, 0.5),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B6'), 4, 8, 'F', false, false, 0.6),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B6'), 4, 8, 'M', false, false, 0.6),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B6'), 9, 13, 'F', false, false, 1),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B6'), 9, 13, 'M', false, false, 1),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B6'), 14, 18, 'F', false, false, 1.2),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B6'), 14, 18, 'M', false, false, 1.3),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B6'), 19, 30, 'F', false, false, 1.3),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B6'), 19, 30, 'M', false, false, 1.3),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B6'), 31, 50, 'F', false, false, 1.3),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B6'), 31, 50, 'M', false, false, 1.3),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B6'), 51, 150, 'F', false, false, 1.5),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B6'), 51, 150, 'M', false, false, 1.7);

insert into reference_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B12'), 1, 3, 'F', false, false, 0.9),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B12'), 1, 3, 'M', false, false, 0.9),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B12'), 4, 8, 'F', false, false, 1.2),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B12'), 4, 8, 'M', false, false, 1.2),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B12'), 9, 13, 'F', false, false, 1.8),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B12'), 9, 13, 'M', false, false, 1.8),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B12'), 14, 18, 'F', false, false, 2.4),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B12'), 14, 18, 'M', false, false, 2.4),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B12'), 19, 30, 'F', false, false, 2.4),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B12'), 19, 30, 'M', false, false, 2.4),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B12'), 31, 50, 'F', false, false, 2.4),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B12'), 31, 50, 'M', false, false, 2.4),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B12'), 51, 150, 'F', false, false, 2.4),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B12'), 51, 150, 'M', false, false, 2.4);

insert into reference_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Choline, total'), 1, 3, 'F', false, false, 200),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Choline, total'), 1, 3, 'M', false, false, 200),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Choline, total'), 4, 8, 'F', false, false, 250),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Choline, total'), 4, 8, 'M', false, false, 250),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Choline, total'), 9, 13, 'F', false, false, 375),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Choline, total'), 9, 13, 'M', false, false, 375),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Choline, total'), 14, 18, 'F', false, false, 400),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Choline, total'), 14, 18, 'M', false, false, 550),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Choline, total'), 19, 30, 'F', false, false, 425),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Choline, total'), 19, 30, 'M', false, false, 550),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Choline, total'), 31, 50, 'F', false, false, 425),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Choline, total'), 31, 50, 'M', false, false, 550),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Choline, total'), 51, 150, 'F', false, false, 425),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Choline, total'), 51, 150, 'M', false, false, 550);

insert into reference_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin K'), 1, 3, 'F', false, false, 30),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin K'), 1, 3, 'M', false, false, 30),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin K'), 4, 8, 'F', false, false, 55),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin K'), 4, 8, 'M', false, false, 55),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin K'), 9, 13, 'F', false, false, 60),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin K'), 9, 13, 'M', false, false, 60),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin K'), 14, 18, 'F', false, false, 75),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin K'), 14, 18, 'M', false, false, 75),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin K'), 19, 30, 'F', false, false, 90),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin K'), 19, 30, 'M', false, false, 120),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin K'), 31, 50, 'F', false, false, 90),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin K'), 31, 50, 'M', false, false, 120),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin K'), 51, 150, 'F', false, false, 90),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin K'), 51, 150, 'M', false, false, 120);

insert into reference_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B9, DFE'), 1, 3, 'F', false, false, 150),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B9, DFE'), 1, 3, 'M', false, false, 150),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B9, DFE'), 4, 8, 'F', false, false, 200),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B9, DFE'), 4, 8, 'M', false, false, 200),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B9, DFE'), 9, 13, 'F', false, false, 300),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B9, DFE'), 9, 13, 'M', false, false, 300),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B9, DFE'), 14, 18, 'F', false, false, 400),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B9, DFE'), 14, 18, 'M', false, false, 400),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B9, DFE'), 19, 30, 'F', false, false, 400),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B9, DFE'), 19, 30, 'M', false, false, 400),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B9, DFE'), 31, 50, 'F', false, false, 400),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B9, DFE'), 31, 50, 'M', false, false, 400),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B9, DFE'), 51, 150, 'F', false, false, 400),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Vitamin B9, DFE'), 51, 150, 'M', false, false, 400);
