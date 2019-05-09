insert into reference_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Sodium'), 1, 3, 'F', false, false, 1500),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Sodium'), 1, 3, 'M', false, false, 1500),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Sodium'), 4, 8, 'F', false, false, 1900),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Sodium'), 4, 8, 'M', false, false, 1900),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Sodium'), 9, 13, 'F', false, false, 2200),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Sodium'), 9, 13, 'M', false, false, 2200),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Sodium'), 14, 150, 'F', false, false, 2300),
((select id from data_sources where short_title = 'USA''s Dietary Guidelines'), (select id from nutrients where name = 'Sodium'), 14, 150, 'M', false, false, 2300);

-- NOTE For infants (i.e. younger than 1 year of age), the values are averaged between the two available groups (0–5.9 months and 6–11.9 months).
-- NOTE Access to source documents: http://nationalacademies.org/hmd/Activities/Nutrition/SummaryDRIs/DRI-Tables.aspx

insert into data_sources (short_title, title, url)
values ('National Academies'' Tolerable Upper Intake Levels', 'Dietary Reference Intakes (DRIs): Tolerable Upper Intake Levels', 'http://nationalacademies.org/hmd/~/media/Files/Report%20Files/2019/DRI-Tables-2019/4_TUILVVE.pdf');

insert into tolerable_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin A, RAE'), 0, 3, 'F', false, false, 600),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin A, RAE'), 0, 3, 'M', false, false, 600),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin A, RAE'), 4, 8, 'F', false, false, 900),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin A, RAE'), 4, 8, 'M', false, false, 900),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin A, RAE'), 9, 13, 'F', false, false, 1700),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin A, RAE'), 9, 13, 'M', false, false, 1700),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin A, RAE'), 14, 18, 'F', false, false, 2800),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin A, RAE'), 14, 18, 'M', false, false, 2800),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin A, RAE'), 19, 150, 'F', false, false, 3000),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin A, RAE'), 19, 150, 'M', false, false, 3000);

insert into tolerable_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin C'), 1, 3, 'F', false, false, 400),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin C'), 1, 3, 'M', false, false, 400),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin C'), 4, 8, 'F', false, false, 650),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin C'), 4, 8, 'M', false, false, 650),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin C'), 9, 13, 'F', false, false, 1200),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin C'), 9, 13, 'M', false, false, 1200),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin C'), 14, 18, 'F', false, false, 1800),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin C'), 14, 18, 'M', false, false, 1800),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin C'), 19, 150, 'F', false, false, 2000),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin C'), 19, 150, 'M', false, false, 2000);

-- TODO Consider setting these values for 'Vitamin D' instead.
insert into tolerable_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin D (D2 + D3)'), 0, 1, 'F', false, false, 32),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin D (D2 + D3)'), 0, 1, 'M', false, false, 32),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin D (D2 + D3)'), 1, 3, 'F', false, false, 63),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin D (D2 + D3)'), 1, 3, 'M', false, false, 63),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin D (D2 + D3)'), 4, 8, 'F', false, false, 75),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin D (D2 + D3)'), 4, 8, 'M', false, false, 75),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin D (D2 + D3)'), 9, 150, 'F', false, false, 100),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin D (D2 + D3)'), 9, 150, 'M', false, false, 100);

insert into tolerable_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin E, added'), 1, 3, 'F', false, false, 200),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin E, added'), 1, 3, 'M', false, false, 200),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin E, added'), 4, 8, 'F', false, false, 300),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin E, added'), 4, 8, 'M', false, false, 300),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin E, added'), 9, 13, 'F', false, false, 600),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin E, added'), 9, 13, 'M', false, false, 600),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin E, added'), 14, 18, 'F', false, false, 800),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin E, added'), 14, 18, 'M', false, false, 800),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin E, added'), 19, 150, 'F', false, false, 1000),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin E, added'), 19, 150, 'M', false, false, 1000);

insert into tolerable_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin B6'), 1, 3, 'F', false, false, 30),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin B6'), 1, 3, 'M', false, false, 30),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin B6'), 4, 8, 'F', false, false, 40),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin B6'), 4, 8, 'M', false, false, 40),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin B6'), 9, 13, 'F', false, false, 60),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin B6'), 9, 13, 'M', false, false, 60),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin B6'), 14, 18, 'F', false, false, 80),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin B6'), 14, 18, 'M', false, false, 80),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin B6'), 19, 150, 'F', false, false, 100),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin B6'), 19, 150, 'M', false, false, 100);

-- TODO Double-check units: the document gives µg/d of supplemental folate, whereas the USDA database registers DFEs.
-- insert into tolerable_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
-- ((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin B9, DFE'), 1, 3, 'F', false, false, 300),
-- ((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin B9, DFE'), 1, 3, 'M', false, false, 300),
-- ((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin B9, DFE'), 4, 8, 'F', false, false, 400),
-- ((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin B9, DFE'), 4, 8, 'M', false, false, 400),
-- ((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin B9, DFE'), 9, 13, 'F', false, false, 600),
-- ((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin B9, DFE'), 9, 13, 'M', false, false, 600),
-- ((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin B9, DFE'), 14, 18, 'F', false, false, 800),
-- ((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin B9, DFE'), 14, 18, 'M', false, false, 800),
-- ((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin B9, DFE'), 19, 150, 'F', false, false, 1000),
-- ((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Vitamin B9, DFE'), 19, 150, 'M', false, false, 1000);

-- NOTE Units differ.
insert into tolerable_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Choline, total'), 1, 8, 'F', false, false, 1000),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Choline, total'), 1, 8, 'M', false, false, 1000),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Choline, total'), 9, 13, 'F', false, false, 2000),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Choline, total'), 9, 13, 'M', false, false, 2000),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Choline, total'), 14, 18, 'F', false, false, 3000),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Choline, total'), 14, 18, 'M', false, false, 3000),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Choline, total'), 19, 150, 'F', false, false, 3500),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Choline, total'), 19, 150, 'M', false, false, 3500);

-- Minerals.

insert into tolerable_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Calcium'), 0, 1, 'F', false, false, 1250),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Calcium'), 0, 1, 'M', false, false, 1250),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Calcium'), 1, 8, 'F', false, false, 2500),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Calcium'), 1, 8, 'M', false, false, 2500),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Calcium'), 9, 18, 'F', false, false, 3000),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Calcium'), 9, 18, 'M', false, false, 3000),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Calcium'), 19, 50, 'F', false, false, 2500),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Calcium'), 19, 50, 'M', false, false, 2500),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Calcium'), 50, 150, 'F', false, false, 2000),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Calcium'), 50, 150, 'M', false, false, 2000);

-- NOTE Units differ.
insert into tolerable_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Copper'), 1, 3, 'F', false, false, 1),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Copper'), 1, 3, 'M', false, false, 1),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Copper'), 4, 8, 'F', false, false, 3),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Copper'), 4, 8, 'M', false, false, 3),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Copper'), 9, 13, 'F', false, false, 5),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Copper'), 9, 13, 'M', false, false, 5),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Copper'), 14, 18, 'F', false, false, 8),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Copper'), 14, 18, 'M', false, false, 8),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Copper'), 19, 150, 'F', false, false, 10),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Copper'), 19, 150, 'M', false, false, 10);

-- NOTE Units differ.
insert into tolerable_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Fluoride'), 0, 1, 'F', false, false, 800),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Fluoride'), 0, 1, 'M', false, false, 800),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Fluoride'), 1, 3, 'F', false, false, 1300),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Fluoride'), 1, 3, 'M', false, false, 1300),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Fluoride'), 4, 8, 'F', false, false, 2200),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Fluoride'), 4, 8, 'M', false, false, 2200),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Fluoride'), 9, 150, 'F', false, false, 10000),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Fluoride'), 9, 150, 'M', false, false, 10000);

insert into tolerable_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Iodine'), 1, 3, 'F', false, false, 200),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Iodine'), 1, 3, 'M', false, false, 200),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Iodine'), 4, 8, 'F', false, false, 300),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Iodine'), 4, 8, 'M', false, false, 300),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Iodine'), 9, 13, 'F', false, false, 600),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Iodine'), 9, 13, 'M', false, false, 600),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Iodine'), 14, 18, 'F', false, false, 900),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Iodine'), 14, 18, 'M', false, false, 900),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Iodine'), 19, 150, 'F', false, false, 1100),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Iodine'), 19, 150, 'M', false, false, 1100);

insert into tolerable_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Iron'), 0, 13, 'F', false, false, 40),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Iron'), 0, 13, 'M', false, false, 40),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Iron'), 14, 150, 'F', false, false, 45),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Iron'), 14, 150, 'M', false, false, 45);

-- TODO Register 'Magnesium, added'
-- insert into tolerable_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
-- ((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Magnesium'), 1, 3, 'F', false, false, 65),
-- ((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Magnesium'), 1, 3, 'M', false, false, 65),
-- ((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Magnesium'), 4, 8, 'F', false, false, 110),
-- ((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Magnesium'), 4, 8, 'M', false, false, 110),
-- ((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Magnesium'), 9, 150, 'F', false, false, 350),
-- ((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Magnesium'), 9, 150, 'M', false, false, 350);

insert into tolerable_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Manganese'), 1, 3, 'F', false, false, 2),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Manganese'), 1, 3, 'M', false, false, 2),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Manganese'), 4, 8, 'F', false, false, 3),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Manganese'), 4, 8, 'M', false, false, 3),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Manganese'), 9, 13, 'F', false, false, 6),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Manganese'), 9, 13, 'M', false, false, 6),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Manganese'), 14, 18, 'F', false, false, 9),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Manganese'), 14, 18, 'M', false, false, 9),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Manganese'), 19, 150, 'F', false, false, 11),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Manganese'), 19, 150, 'M', false, false, 11);

insert into tolerable_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Molybdenum'), 1, 3, 'F', false, false, 300),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Molybdenum'), 1, 3, 'M', false, false, 300),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Molybdenum'), 4, 8, 'F', false, false, 600),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Molybdenum'), 4, 8, 'M', false, false, 600),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Molybdenum'), 9, 13, 'F', false, false, 1100),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Molybdenum'), 9, 13, 'M', false, false, 1100),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Molybdenum'), 14, 18, 'F', false, false, 1700),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Molybdenum'), 14, 18, 'M', false, false, 1700),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Molybdenum'), 19, 150, 'F', false, false, 2000),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Molybdenum'), 19, 150, 'M', false, false, 2000);

-- NOTE Units differ.
insert into tolerable_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Phosphorus'), 1, 8, 'F', false, false, 3000),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Phosphorus'), 1, 8, 'M', false, false, 3000),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Phosphorus'), 9, 70, 'F', false, false, 4000),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Phosphorus'), 9, 70, 'M', false, false, 4000),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Phosphorus'), 71, 150, 'F', false, false, 3000),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Phosphorus'), 71, 150, 'M', false, false, 3000),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Phosphorus'), 14, 50, 'F', true, false, 3500);

insert into tolerable_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Selenium'), 0, 1, 'F', false, false, 53),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Selenium'), 0, 1, 'M', false, false, 53),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Selenium'), 1, 3, 'F', false, false, 90),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Selenium'), 1, 3, 'M', false, false, 90),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Selenium'), 4, 8, 'F', false, false, 150),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Selenium'), 4, 8, 'M', false, false, 150),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Selenium'), 9, 13, 'F', false, false, 280),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Selenium'), 9, 13, 'M', false, false, 280),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Selenium'), 14, 150, 'F', false, false, 400),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Selenium'), 14, 150, 'M', false, false, 400);

insert into tolerable_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Zinc'), 0, 1, 'F', false, false, 5),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Zinc'), 0, 1, 'M', false, false, 5),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Zinc'), 1, 3, 'F', false, false, 7),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Zinc'), 1, 3, 'M', false, false, 7),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Zinc'), 4, 8, 'F', false, false, 12),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Zinc'), 4, 8, 'M', false, false, 12),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Zinc'), 9, 13, 'F', false, false, 23),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Zinc'), 9, 13, 'M', false, false, 23),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Zinc'), 14, 18, 'F', false, false, 34),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Zinc'), 14, 18, 'M', false, false, 34),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Zinc'), 19, 150, 'F', false, false, 40),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Zinc'), 19, 150, 'M', false, false, 40);

-- NOTE Units differ.
insert into tolerable_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Sodium'), 1, 3, 'F', false, false, 1500),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Sodium'), 1, 3, 'M', false, false, 1500),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Sodium'), 4, 8, 'F', false, false, 1900),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Sodium'), 4, 8, 'M', false, false, 1900),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Sodium'), 9, 13, 'F', false, false, 2200),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Sodium'), 9, 13, 'M', false, false, 2200),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Sodium'), 14, 150, 'F', false, false, 2300),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Sodium'), 14, 150, 'M', false, false, 2300);

insert into tolerable_intakes (source_id, nutrient_id, age_min, age_max, gender, for_pregnancy, for_lactation, value) values
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Chloride'), 1, 3, 'F', false, false, 2.3),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Chloride'), 1, 3, 'M', false, false, 2.3),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Chloride'), 4, 8, 'F', false, false, 2.9),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Chloride'), 4, 8, 'M', false, false, 2.9),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Chloride'), 9, 13, 'F', false, false, 3.4),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Chloride'), 9, 13, 'M', false, false, 3.4),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Chloride'), 14, 150, 'F', false, false, 3.6),
((select id from data_sources where short_title = 'National Academies'' Tolerable Upper Intake Levels'), (select id from nutrients where name = 'Chloride'), 14, 150, 'M', false, false, 3.6);
