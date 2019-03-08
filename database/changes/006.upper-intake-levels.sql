-- Tolerable upper (daily) intake levels.
create table tuil (
    id serial primary key,
    nutr_no char(3) not null,
    age_min int not null,
    age_max int not null,
    gender char(1) not null,
    pregnancy char(1) not null default 'N',
    lactation char(1) not null default 'N',
    value float not null,

    constraint uk_tuil_all unique (nutr_no, age_min, age_max, gender, pregnancy, lactation),
    constraint fk_tuil_nutr_def foreign key (nutr_no) references nutr_def(nutr_no),
    constraint chk_tuil_age check (age_min < age_max),
    constraint chk_tuil_age_min check (age_min >= 0 and age_min <= 150),
    constraint chk_tuil_age_max check (age_max >= 0 and age_max <= 150),
    constraint chk_tuil_gender check (gender in ('M', 'F')),
    constraint chk_tuil_pregnancy check (pregnancy in ('Y', 'N')),
    constraint chk_tuil_lactation check (lactation in ('Y', 'N')),
    constraint chk_tuil_pregnancy_women check (pregnancy = 'N' or (pregnancy = 'Y' and gender = 'F')),
    constraint chk_tuil_lactation_women check (lactation = 'N' or (lactation = 'Y' and gender = 'F'))
);

-- Source: http://www.nationalacademies.org/hmd/~/media/Files/Activity%20Files/Nutrition/DRI-Tables/4_%20UL%20Values_Vitamins%20and%20Elements.pdf.
-- NOTE For infants (i.e. younger than 1 year of age), the values are averaged between the two available groups (0-to-6 months and 6-to-12 months).
-- TODO Take into account footnotes.

-- Vitamins.

insert into tuil (nutr_no, age_min, age_max, gender, value) values
((select nutr_no from nutr_def where nutrdesc = 'Vitamin A, RAE'), 0, 3, 'F', 600),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin A, RAE'), 0, 3, 'M', 600),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin A, RAE'), 4, 8, 'F', 900),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin A, RAE'), 4, 8, 'M', 900),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin A, RAE'), 9, 13, 'F', 1700),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin A, RAE'), 9, 13, 'M', 1700),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin A, RAE'), 14, 18, 'F', 2800),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin A, RAE'), 14, 18, 'M', 2800),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin A, RAE'), 19, 150, 'F', 3000),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin A, RAE'), 19, 150, 'M', 3000);

insert into tuil (nutr_no, age_min, age_max, gender, value) values
((select nutr_no from nutr_def where nutrdesc = 'Vitamin C, total ascorbic acid'), 1, 3, 'F', 400),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin C, total ascorbic acid'), 1, 3, 'M', 400),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin C, total ascorbic acid'), 4, 8, 'F', 650),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin C, total ascorbic acid'), 4, 8, 'M', 650),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin C, total ascorbic acid'), 9, 13, 'F', 1200),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin C, total ascorbic acid'), 9, 13, 'M', 1200),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin C, total ascorbic acid'), 14, 18, 'F', 1800),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin C, total ascorbic acid'), 14, 18, 'M', 1800),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin C, total ascorbic acid'), 19, 150, 'F', 2000),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin C, total ascorbic acid'), 19, 150, 'M', 2000);

insert into tuil (nutr_no, age_min, age_max, gender, value) values
((select nutr_no from nutr_def where nutrdesc = 'Vitamin D (D2 + D3)'), 0, 1, 'F', 32),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin D (D2 + D3)'), 0, 1, 'M', 32),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin D (D2 + D3)'), 1, 3, 'F', 63),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin D (D2 + D3)'), 1, 3, 'M', 63),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin D (D2 + D3)'), 4, 8, 'F', 75),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin D (D2 + D3)'), 4, 8, 'M', 75),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin D (D2 + D3)'), 9, 150, 'F', 100),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin D (D2 + D3)'), 9, 150, 'M', 100);

insert into tuil (nutr_no, age_min, age_max, gender, value) values
((select nutr_no from nutr_def where nutrdesc = 'Vitamin E (alpha-tocopherol)'), 1, 3, 'F', 200),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin E (alpha-tocopherol)'), 1, 3, 'M', 200),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin E (alpha-tocopherol)'), 4, 8, 'F', 300),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin E (alpha-tocopherol)'), 4, 8, 'M', 300),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin E (alpha-tocopherol)'), 9, 13, 'F', 600),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin E (alpha-tocopherol)'), 9, 13, 'M', 600),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin E (alpha-tocopherol)'), 14, 18, 'F', 800),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin E (alpha-tocopherol)'), 14, 18, 'M', 800),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin E (alpha-tocopherol)'), 19, 150, 'F', 1000),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin E (alpha-tocopherol)'), 19, 150, 'M', 1000);

insert into tuil (nutr_no, age_min, age_max, gender, value) values
((select nutr_no from nutr_def where nutrdesc = 'Vitamin E, added'), 1, 3, 'F', 200),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin E, added'), 1, 3, 'M', 200),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin E, added'), 4, 8, 'F', 300),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin E, added'), 4, 8, 'M', 300),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin E, added'), 9, 13, 'F', 600),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin E, added'), 9, 13, 'M', 600),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin E, added'), 14, 18, 'F', 800),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin E, added'), 14, 18, 'M', 800),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin E, added'), 19, 150, 'F', 1000),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin E, added'), 19, 150, 'M', 1000);

insert into tuil (nutr_no, age_min, age_max, gender, value) values
((select Nutr_No from nutr_def where display_name = 'Vitamin B3'), 1, 3, 'F', 10),
((select Nutr_No from nutr_def where display_name = 'Vitamin B3'), 1, 3, 'M', 10),
((select Nutr_No from nutr_def where display_name = 'Vitamin B3'), 4, 8, 'F', 15),
((select Nutr_No from nutr_def where display_name = 'Vitamin B3'), 4, 8, 'M', 15),
((select Nutr_No from nutr_def where display_name = 'Vitamin B3'), 9, 13, 'F', 20),
((select Nutr_No from nutr_def where display_name = 'Vitamin B3'), 9, 13, 'M', 20),
((select Nutr_No from nutr_def where display_name = 'Vitamin B3'), 14, 18, 'F', 30),
((select Nutr_No from nutr_def where display_name = 'Vitamin B3'), 14, 18, 'M', 30),
((select Nutr_No from nutr_def where display_name = 'Vitamin B3'), 19, 150, 'F', 35),
((select Nutr_No from nutr_def where display_name = 'Vitamin B3'), 19, 150, 'M', 35);

insert into tuil (nutr_no, age_min, age_max, gender, value) values
((select nutr_no from nutr_def where nutrdesc = 'Vitamin B-6'), 1, 3, 'F', 30),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin B-6'), 1, 3, 'M', 30),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin B-6'), 4, 8, 'F', 40),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin B-6'), 4, 8, 'M', 40),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin B-6'), 9, 13, 'F', 60),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin B-6'), 9, 13, 'M', 60),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin B-6'), 14, 18, 'F', 80),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin B-6'), 14, 18, 'M', 80),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin B-6'), 19, 150, 'F', 100),
((select nutr_no from nutr_def where nutrdesc = 'Vitamin B-6'), 19, 150, 'M', 100);

insert into tuil (nutr_no, age_min, age_max, gender, value) values
((select nutr_no from nutr_def where nutrdesc = 'Folate, DFE'), 1, 3, 'F', 300),
((select nutr_no from nutr_def where nutrdesc = 'Folate, DFE'), 1, 3, 'M', 300),
((select nutr_no from nutr_def where nutrdesc = 'Folate, DFE'), 4, 8, 'F', 400),
((select nutr_no from nutr_def where nutrdesc = 'Folate, DFE'), 4, 8, 'M', 400),
((select nutr_no from nutr_def where nutrdesc = 'Folate, DFE'), 9, 13, 'F', 600),
((select nutr_no from nutr_def where nutrdesc = 'Folate, DFE'), 9, 13, 'M', 600),
((select nutr_no from nutr_def where nutrdesc = 'Folate, DFE'), 14, 18, 'F', 800),
((select nutr_no from nutr_def where nutrdesc = 'Folate, DFE'), 14, 18, 'M', 800),
((select nutr_no from nutr_def where nutrdesc = 'Folate, DFE'), 19, 150, 'F', 1000),
((select nutr_no from nutr_def where nutrdesc = 'Folate, DFE'), 19, 150, 'M', 1000);

insert into tuil (nutr_no, age_min, age_max, gender, value) values
((select nutr_no from nutr_def where nutrdesc = 'Folate, food'), 1, 3, 'F', 300),
((select nutr_no from nutr_def where nutrdesc = 'Folate, food'), 1, 3, 'M', 300),
((select nutr_no from nutr_def where nutrdesc = 'Folate, food'), 4, 8, 'F', 400),
((select nutr_no from nutr_def where nutrdesc = 'Folate, food'), 4, 8, 'M', 400),
((select nutr_no from nutr_def where nutrdesc = 'Folate, food'), 9, 13, 'F', 600),
((select nutr_no from nutr_def where nutrdesc = 'Folate, food'), 9, 13, 'M', 600),
((select nutr_no from nutr_def where nutrdesc = 'Folate, food'), 14, 18, 'F', 800),
((select nutr_no from nutr_def where nutrdesc = 'Folate, food'), 14, 18, 'M', 800),
((select nutr_no from nutr_def where nutrdesc = 'Folate, food'), 19, 150, 'F', 1000),
((select nutr_no from nutr_def where nutrdesc = 'Folate, food'), 19, 150, 'M', 1000);

insert into tuil (nutr_no, age_min, age_max, gender, value) values
((select nutr_no from nutr_def where nutrdesc = 'Folate, total'), 1, 3, 'F', 300),
((select nutr_no from nutr_def where nutrdesc = 'Folate, total'), 1, 3, 'M', 300),
((select nutr_no from nutr_def where nutrdesc = 'Folate, total'), 4, 8, 'F', 400),
((select nutr_no from nutr_def where nutrdesc = 'Folate, total'), 4, 8, 'M', 400),
((select nutr_no from nutr_def where nutrdesc = 'Folate, total'), 9, 13, 'F', 600),
((select nutr_no from nutr_def where nutrdesc = 'Folate, total'), 9, 13, 'M', 600),
((select nutr_no from nutr_def where nutrdesc = 'Folate, total'), 14, 18, 'F', 800),
((select nutr_no from nutr_def where nutrdesc = 'Folate, total'), 14, 18, 'M', 800),
((select nutr_no from nutr_def where nutrdesc = 'Folate, total'), 19, 150, 'F', 1000),
((select nutr_no from nutr_def where nutrdesc = 'Folate, total'), 19, 150, 'M', 1000);

-- NOTE Units differ.
insert into tuil (nutr_no, age_min, age_max, gender, value) values
((select nutr_no from nutr_def where nutrdesc = 'Choline, total'), 1, 8, 'F', 1000),
((select nutr_no from nutr_def where nutrdesc = 'Choline, total'), 1, 8, 'M', 1000),
((select nutr_no from nutr_def where nutrdesc = 'Choline, total'), 9, 13, 'F', 2000),
((select nutr_no from nutr_def where nutrdesc = 'Choline, total'), 9, 13, 'M', 2000),
((select nutr_no from nutr_def where nutrdesc = 'Choline, total'), 14, 18, 'F', 3000),
((select nutr_no from nutr_def where nutrdesc = 'Choline, total'), 14, 18, 'M', 3000),
((select nutr_no from nutr_def where nutrdesc = 'Choline, total'), 19, 150, 'F', 3500),
((select nutr_no from nutr_def where nutrdesc = 'Choline, total'), 19, 150, 'M', 3500);

-- Minerals. // Not entered: boron, nickel, vanadium.

-- Tagname source: http://www.fao.org/infoods/infoods/standards-guidelines/food-component-identifiers-tagnames/en/.
insert into nutr_def (nutr_no, units, tagname, nutrdesc, num_dec, sr_order, interest, is_essential, display_name) values
('900', 'µg', 'ID', 'Iodine, I', 0, 6250, 5, 'Y', null),
('901', 'µg', 'MO', 'Molybdenum, Mo', 0, 6255, 5, 'Y', null),
('903', 'g', 'CLD', 'Chloride, Cl−', 1, 6260, 5, 'N', null);

insert into tuil (nutr_no, age_min, age_max, gender, value) values
((select nutr_no from nutr_def where nutrdesc = 'Calcium, Ca'), 0, 1, 'F', 1250),
((select nutr_no from nutr_def where nutrdesc = 'Calcium, Ca'), 0, 1, 'M', 1250),
((select nutr_no from nutr_def where nutrdesc = 'Calcium, Ca'), 1, 8, 'F', 2500),
((select nutr_no from nutr_def where nutrdesc = 'Calcium, Ca'), 1, 8, 'M', 2500),
((select nutr_no from nutr_def where nutrdesc = 'Calcium, Ca'), 9, 18, 'F', 3000),
((select nutr_no from nutr_def where nutrdesc = 'Calcium, Ca'), 9, 18, 'M', 3000),
((select nutr_no from nutr_def where nutrdesc = 'Calcium, Ca'), 19, 50, 'F', 2500),
((select nutr_no from nutr_def where nutrdesc = 'Calcium, Ca'), 19, 50, 'M', 2500),
((select nutr_no from nutr_def where nutrdesc = 'Calcium, Ca'), 50, 150, 'F', 2000),
((select nutr_no from nutr_def where nutrdesc = 'Calcium, Ca'), 50, 150, 'M', 2000);

-- NOTE Units differ.
insert into tuil (nutr_no, age_min, age_max, gender, value) values
((select nutr_no from nutr_def where nutrdesc = 'Copper, Cu'), 1, 3, 'F', 1),
((select nutr_no from nutr_def where nutrdesc = 'Copper, Cu'), 1, 3, 'M', 1),
((select nutr_no from nutr_def where nutrdesc = 'Copper, Cu'), 4, 8, 'F', 3),
((select nutr_no from nutr_def where nutrdesc = 'Copper, Cu'), 4, 8, 'M', 3),
((select nutr_no from nutr_def where nutrdesc = 'Copper, Cu'), 9, 13, 'F', 5),
((select nutr_no from nutr_def where nutrdesc = 'Copper, Cu'), 9, 13, 'M', 5),
((select nutr_no from nutr_def where nutrdesc = 'Copper, Cu'), 14, 18, 'F', 8),
((select nutr_no from nutr_def where nutrdesc = 'Copper, Cu'), 14, 18, 'M', 8),
((select nutr_no from nutr_def where nutrdesc = 'Copper, Cu'), 19, 150, 'F', 10),
((select nutr_no from nutr_def where nutrdesc = 'Copper, Cu'), 19, 150, 'M', 10);

-- NOTE Units differ.
insert into tuil (nutr_no, age_min, age_max, gender, value) values
((select nutr_no from nutr_def where nutrdesc = 'Fluoride, F'), 0, 1, 'F', 800),
((select nutr_no from nutr_def where nutrdesc = 'Fluoride, F'), 0, 1, 'M', 800),
((select nutr_no from nutr_def where nutrdesc = 'Fluoride, F'), 1, 3, 'F', 1300),
((select nutr_no from nutr_def where nutrdesc = 'Fluoride, F'), 1, 3, 'M', 1300),
((select nutr_no from nutr_def where nutrdesc = 'Fluoride, F'), 4, 8, 'F', 2200),
((select nutr_no from nutr_def where nutrdesc = 'Fluoride, F'), 4, 8, 'M', 2200),
((select nutr_no from nutr_def where nutrdesc = 'Fluoride, F'), 9, 150, 'F', 10000),
((select nutr_no from nutr_def where nutrdesc = 'Fluoride, F'), 9, 150, 'M', 10000);

insert into tuil (nutr_no, age_min, age_max, gender, value) values
((select nutr_no from nutr_def where nutrdesc = 'Iodine, I'), 1, 3, 'F', 200),
((select nutr_no from nutr_def where nutrdesc = 'Iodine, I'), 1, 3, 'M', 200),
((select nutr_no from nutr_def where nutrdesc = 'Iodine, I'), 4, 8, 'F', 300),
((select nutr_no from nutr_def where nutrdesc = 'Iodine, I'), 4, 8, 'M', 300),
((select nutr_no from nutr_def where nutrdesc = 'Iodine, I'), 9, 13, 'F', 600),
((select nutr_no from nutr_def where nutrdesc = 'Iodine, I'), 9, 13, 'M', 600),
((select nutr_no from nutr_def where nutrdesc = 'Iodine, I'), 14, 18, 'F', 900),
((select nutr_no from nutr_def where nutrdesc = 'Iodine, I'), 14, 18, 'M', 900),
((select nutr_no from nutr_def where nutrdesc = 'Iodine, I'), 19, 150, 'F', 1100),
((select nutr_no from nutr_def where nutrdesc = 'Iodine, I'), 19, 150, 'M', 1100);

insert into tuil (nutr_no, age_min, age_max, gender, value) values
((select nutr_no from nutr_def where nutrdesc = 'Iron, Fe'), 0, 13, 'F', 40),
((select nutr_no from nutr_def where nutrdesc = 'Iron, Fe'), 0, 13, 'M', 40),
((select nutr_no from nutr_def where nutrdesc = 'Iron, Fe'), 14, 150, 'F', 45),
((select nutr_no from nutr_def where nutrdesc = 'Iron, Fe'), 14, 150, 'M', 45);

insert into tuil (nutr_no, age_min, age_max, gender, value) values
((select nutr_no from nutr_def where nutrdesc = 'Magnesium, Mg'), 1, 3, 'F', 65),
((select nutr_no from nutr_def where nutrdesc = 'Magnesium, Mg'), 1, 3, 'M', 65),
((select nutr_no from nutr_def where nutrdesc = 'Magnesium, Mg'), 4, 8, 'F', 110),
((select nutr_no from nutr_def where nutrdesc = 'Magnesium, Mg'), 4, 8, 'M', 110),
((select nutr_no from nutr_def where nutrdesc = 'Magnesium, Mg'), 9, 150, 'F', 350),
((select nutr_no from nutr_def where nutrdesc = 'Magnesium, Mg'), 9, 150, 'M', 350);

insert into tuil (nutr_no, age_min, age_max, gender, value) values
((select nutr_no from nutr_def where nutrdesc = 'Manganese, Mn'), 1, 3, 'F', 2),
((select nutr_no from nutr_def where nutrdesc = 'Manganese, Mn'), 1, 3, 'M', 2),
((select nutr_no from nutr_def where nutrdesc = 'Manganese, Mn'), 4, 8, 'F', 3),
((select nutr_no from nutr_def where nutrdesc = 'Manganese, Mn'), 4, 8, 'M', 3),
((select nutr_no from nutr_def where nutrdesc = 'Manganese, Mn'), 9, 13, 'F', 6),
((select nutr_no from nutr_def where nutrdesc = 'Manganese, Mn'), 9, 13, 'M', 6),
((select nutr_no from nutr_def where nutrdesc = 'Manganese, Mn'), 14, 18, 'F', 9),
((select nutr_no from nutr_def where nutrdesc = 'Manganese, Mn'), 14, 18, 'M', 9),
((select nutr_no from nutr_def where nutrdesc = 'Manganese, Mn'), 19, 150, 'F', 11),
((select nutr_no from nutr_def where nutrdesc = 'Manganese, Mn'), 19, 150, 'M', 11);

insert into tuil (nutr_no, age_min, age_max, gender, value) values
((select nutr_no from nutr_def where nutrdesc = 'Molybdenum, Mo'), 1, 3, 'F', 300),
((select nutr_no from nutr_def where nutrdesc = 'Molybdenum, Mo'), 1, 3, 'M', 300),
((select nutr_no from nutr_def where nutrdesc = 'Molybdenum, Mo'), 4, 8, 'F', 600),
((select nutr_no from nutr_def where nutrdesc = 'Molybdenum, Mo'), 4, 8, 'M', 600),
((select nutr_no from nutr_def where nutrdesc = 'Molybdenum, Mo'), 9, 13, 'F', 1100),
((select nutr_no from nutr_def where nutrdesc = 'Molybdenum, Mo'), 9, 13, 'M', 1100),
((select nutr_no from nutr_def where nutrdesc = 'Molybdenum, Mo'), 14, 18, 'F', 1700),
((select nutr_no from nutr_def where nutrdesc = 'Molybdenum, Mo'), 14, 18, 'M', 1700),
((select nutr_no from nutr_def where nutrdesc = 'Molybdenum, Mo'), 19, 150, 'F', 2000),
((select nutr_no from nutr_def where nutrdesc = 'Molybdenum, Mo'), 19, 150, 'M', 2000);

-- NOTE Units differ.
insert into tuil (nutr_no, age_min, age_max, gender, pregnancy, value) values
((select nutr_no from nutr_def where nutrdesc = 'Phosphorus, P'), 1, 8, 'F', 'N', 3000),
((select nutr_no from nutr_def where nutrdesc = 'Phosphorus, P'), 1, 8, 'M', 'N', 3000),
((select nutr_no from nutr_def where nutrdesc = 'Phosphorus, P'), 9, 70, 'F', 'N', 4000),
((select nutr_no from nutr_def where nutrdesc = 'Phosphorus, P'), 9, 70, 'M', 'N', 4000),
((select nutr_no from nutr_def where nutrdesc = 'Phosphorus, P'), 70, 150, 'F', 'N', 3000),
((select nutr_no from nutr_def where nutrdesc = 'Phosphorus, P'), 70, 150, 'M', 'N', 3000),
((select nutr_no from nutr_def where nutrdesc = 'Phosphorus, P'), 14, 50, 'F', 'Y', 3500);

insert into tuil (nutr_no, age_min, age_max, gender, value) values
((select nutr_no from nutr_def where nutrdesc = 'Selenium, Se'), 0, 1, 'F', 53),
((select nutr_no from nutr_def where nutrdesc = 'Selenium, Se'), 0, 1, 'M', 53),
((select nutr_no from nutr_def where nutrdesc = 'Selenium, Se'), 1, 3, 'F', 90),
((select nutr_no from nutr_def where nutrdesc = 'Selenium, Se'), 1, 3, 'M', 90),
((select nutr_no from nutr_def where nutrdesc = 'Selenium, Se'), 4, 8, 'F', 150),
((select nutr_no from nutr_def where nutrdesc = 'Selenium, Se'), 4, 8, 'M', 150),
((select nutr_no from nutr_def where nutrdesc = 'Selenium, Se'), 9, 13, 'F', 280),
((select nutr_no from nutr_def where nutrdesc = 'Selenium, Se'), 9, 13, 'M', 280),
((select nutr_no from nutr_def where nutrdesc = 'Selenium, Se'), 14, 150, 'F', 400),
((select nutr_no from nutr_def where nutrdesc = 'Selenium, Se'), 14, 150, 'M', 400);

insert into tuil (nutr_no, age_min, age_max, gender, value) values
((select nutr_no from nutr_def where nutrdesc = 'Zinc, Zn'), 0, 1, 'F', 5),
((select nutr_no from nutr_def where nutrdesc = 'Zinc, Zn'), 0, 1, 'M', 5),
((select nutr_no from nutr_def where nutrdesc = 'Zinc, Zn'), 1, 3, 'F', 7),
((select nutr_no from nutr_def where nutrdesc = 'Zinc, Zn'), 1, 3, 'M', 7),
((select nutr_no from nutr_def where nutrdesc = 'Zinc, Zn'), 4, 8, 'F', 12),
((select nutr_no from nutr_def where nutrdesc = 'Zinc, Zn'), 4, 8, 'M', 12),
((select nutr_no from nutr_def where nutrdesc = 'Zinc, Zn'), 9, 13, 'F', 23),
((select nutr_no from nutr_def where nutrdesc = 'Zinc, Zn'), 9, 13, 'M', 23),
((select nutr_no from nutr_def where nutrdesc = 'Zinc, Zn'), 14, 18, 'F', 34),
((select nutr_no from nutr_def where nutrdesc = 'Zinc, Zn'), 14, 18, 'M', 34),
((select nutr_no from nutr_def where nutrdesc = 'Zinc, Zn'), 19, 150, 'F', 40),
((select nutr_no from nutr_def where nutrdesc = 'Zinc, Zn'), 19, 150, 'M', 40);

-- NOTE Units differ.
insert into tuil (nutr_no, age_min, age_max, gender, value) values
((select nutr_no from nutr_def where nutrdesc = 'Sodium, Na'), 1, 3, 'F', 1500),
((select nutr_no from nutr_def where nutrdesc = 'Sodium, Na'), 1, 3, 'M', 1500),
((select nutr_no from nutr_def where nutrdesc = 'Sodium, Na'), 4, 8, 'F', 1900),
((select nutr_no from nutr_def where nutrdesc = 'Sodium, Na'), 4, 8, 'M', 1900),
((select nutr_no from nutr_def where nutrdesc = 'Sodium, Na'), 9, 13, 'F', 2200),
((select nutr_no from nutr_def where nutrdesc = 'Sodium, Na'), 9, 13, 'M', 2200),
((select nutr_no from nutr_def where nutrdesc = 'Sodium, Na'), 14, 150, 'F', 2300),
((select nutr_no from nutr_def where nutrdesc = 'Sodium, Na'), 14, 150, 'M', 2300);

insert into tuil (nutr_no, age_min, age_max, gender, value) values
((select nutr_no from nutr_def where nutrdesc = 'Chloride, Cl−'), 1, 3, 'F', 2.3),
((select nutr_no from nutr_def where nutrdesc = 'Chloride, Cl−'), 1, 3, 'M', 2.3),
((select nutr_no from nutr_def where nutrdesc = 'Chloride, Cl−'), 4, 8, 'F', 2.9),
((select nutr_no from nutr_def where nutrdesc = 'Chloride, Cl−'), 4, 8, 'M', 2.9),
((select nutr_no from nutr_def where nutrdesc = 'Chloride, Cl−'), 9, 13, 'F', 3.4),
((select nutr_no from nutr_def where nutrdesc = 'Chloride, Cl−'), 9, 13, 'M', 3.4),
((select nutr_no from nutr_def where nutrdesc = 'Chloride, Cl−'), 14, 150, 'F', 3.6),
((select nutr_no from nutr_def where nutrdesc = 'Chloride, Cl−'), 14, 150, 'M', 3.6);

commit;