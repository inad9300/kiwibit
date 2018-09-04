use usdanlsr28;

create table rdi (
    id        int auto_increment primary key,
    nutr_no   char(3) not null,
    age_min   int unsigned not null,
    age_max   int unsigned not null,
    gender    char(1) not null,
    pregnancy char(1) not null default 'N',
    lactation char(1) not null default 'N',
    type      char(4) not null default 'RDA',
    value     float not null,

    constraint uk_rdi_all unique (nutr_no, age_min, age_max, gender, pregnancy, lactation),
    constraint fk_rdi_nutr_def foreign key (nutr_no) references nutr_def(nutr_no),
    constraint chk_rdi_age check (age_min < age_max),
    constraint chk_rdi_age_min check (age_min <= 150),
    constraint chk_rdi_age_max check (age_max <= 150),
    constraint chk_rdi_gender check (gender in ('M', 'F')),
    constraint chk_rdi_pregnancy check (pregnancy in ('Y', 'N')),
    constraint chk_rdi_lactation check (lactation in ('Y', 'N')),
    constraint chk_rdi_pregnancy_women check (pregnancy = 'N' or (pregnancy = 'Y' and gender = 'F')),
    constraint chk_rdi_lactation_women check (lactation = 'N' or (lactation = 'Y' and gender = 'F')),
    constraint chk_rdi_type check (type in ('RDA', 'AI', 'UL', 'AMDR'))
);

-- Source: https://health.gov/dietaryguidelines/2015/resources/2015-2020_Dietary_Guidelines.pdf, table A7-1.

insert into rdi (nutr_no, age_min, age_max, gender, type, value) values
((select Nutr_No from nutr_def where Tagname = 'ENERC_KCAL'), 1, 3, 'F', 'AI', 1000),
((select Nutr_No from nutr_def where Tagname = 'ENERC_KCAL'), 1, 3, 'M', 'AI', 1000),
((select Nutr_No from nutr_def where Tagname = 'ENERC_KCAL'), 4, 8, 'F', 'AI', 1200),
((select Nutr_No from nutr_def where Tagname = 'ENERC_KCAL'), 4, 8, 'M', 'AI', 1400),
((select Nutr_No from nutr_def where Tagname = 'ENERC_KCAL'), 9, 13, 'F', 'AI', 1600),
((select Nutr_No from nutr_def where Tagname = 'ENERC_KCAL'), 9, 13, 'M', 'AI', 1800),
((select Nutr_No from nutr_def where Tagname = 'ENERC_KCAL'), 14, 18, 'F', 'AI', 1800),
((select Nutr_No from nutr_def where Tagname = 'ENERC_KCAL'), 14, 18, 'M', 'AI', 2200),
((select Nutr_No from nutr_def where Tagname = 'ENERC_KCAL'), 19, 30, 'F', 'AI', 2000),
((select Nutr_No from nutr_def where Tagname = 'ENERC_KCAL'), 19, 30, 'M', 'AI', 2400),
((select Nutr_No from nutr_def where Tagname = 'ENERC_KCAL'), 31, 50, 'F', 'AI', 1800),
((select Nutr_No from nutr_def where Tagname = 'ENERC_KCAL'), 31, 50, 'M', 'AI', 2200),
((select Nutr_No from nutr_def where Tagname = 'ENERC_KCAL'), 51, 150, 'F', 'AI', 1600),
((select Nutr_No from nutr_def where Tagname = 'ENERC_KCAL'), 51, 150, 'M', 'AI', 2000);

insert into rdi (nutr_no, age_min, age_max, gender, type, value) values
((select Nutr_No from nutr_def where NutrDesc = 'Protein'), 1, 3, 'F', 'RDA', 13),
((select Nutr_No from nutr_def where NutrDesc = 'Protein'), 1, 3, 'M', 'RDA', 13),
((select Nutr_No from nutr_def where NutrDesc = 'Protein'), 4, 8, 'F', 'RDA', 19),
((select Nutr_No from nutr_def where NutrDesc = 'Protein'), 4, 8, 'M', 'RDA', 19),
((select Nutr_No from nutr_def where NutrDesc = 'Protein'), 9, 13, 'F', 'RDA', 34),
((select Nutr_No from nutr_def where NutrDesc = 'Protein'), 9, 13, 'M', 'RDA', 34),
((select Nutr_No from nutr_def where NutrDesc = 'Protein'), 14, 18, 'F', 'RDA', 46),
((select Nutr_No from nutr_def where NutrDesc = 'Protein'), 14, 18, 'M', 'RDA', 52),
((select Nutr_No from nutr_def where NutrDesc = 'Protein'), 19, 30, 'F', 'RDA', 46),
((select Nutr_No from nutr_def where NutrDesc = 'Protein'), 19, 30, 'M', 'RDA', 56),
((select Nutr_No from nutr_def where NutrDesc = 'Protein'), 31, 50, 'F', 'RDA', 46),
((select Nutr_No from nutr_def where NutrDesc = 'Protein'), 31, 50, 'M', 'RDA', 56),
((select Nutr_No from nutr_def where NutrDesc = 'Protein'), 51, 150, 'F', 'RDA', 46),
((select Nutr_No from nutr_def where NutrDesc = 'Protein'), 51, 150, 'M', 'RDA', 56);

insert into rdi (nutr_no, age_min, age_max, gender, type, value) values
((select Nutr_No from nutr_def where NutrDesc = 'Carbohydrate, by difference'), 1, 150, 'F', 'RDA', 130),
((select Nutr_No from nutr_def where NutrDesc = 'Carbohydrate, by difference'), 1, 150, 'M', 'RDA', 130);

insert into rdi (nutr_no, age_min, age_max, gender, type, value) values
((select Nutr_No from nutr_def where NutrDesc = 'Fiber, total dietary'), 1, 3, 'F', 'AI', 14),
((select Nutr_No from nutr_def where NutrDesc = 'Fiber, total dietary'), 1, 3, 'M', 'AI', 14),
((select Nutr_No from nutr_def where NutrDesc = 'Fiber, total dietary'), 4, 8, 'F', 'AI', 16.8),
((select Nutr_No from nutr_def where NutrDesc = 'Fiber, total dietary'), 4, 8, 'M', 'AI', 19.6),
((select Nutr_No from nutr_def where NutrDesc = 'Fiber, total dietary'), 9, 13, 'F', 'AI', 22.4),
((select Nutr_No from nutr_def where NutrDesc = 'Fiber, total dietary'), 9, 13, 'M', 'AI', 25.2),
((select Nutr_No from nutr_def where NutrDesc = 'Fiber, total dietary'), 14, 18, 'F', 'AI', 25.2),
((select Nutr_No from nutr_def where NutrDesc = 'Fiber, total dietary'), 14, 18, 'M', 'AI', 30.8),
((select Nutr_No from nutr_def where NutrDesc = 'Fiber, total dietary'), 19, 30, 'F', 'AI', 28),
((select Nutr_No from nutr_def where NutrDesc = 'Fiber, total dietary'), 19, 30, 'M', 'AI', 33.6),
((select Nutr_No from nutr_def where NutrDesc = 'Fiber, total dietary'), 31, 50, 'F', 'AI', 25.2),
((select Nutr_No from nutr_def where NutrDesc = 'Fiber, total dietary'), 31, 50, 'M', 'AI', 30.8),
((select Nutr_No from nutr_def where NutrDesc = 'Fiber, total dietary'), 51, 150, 'F', 'AI', 22.4),
((select Nutr_No from nutr_def where NutrDesc = 'Fiber, total dietary'), 51, 150, 'M', 'AI', 28);

insert into rdi (nutr_no, age_min, age_max, gender, type, value) values
((select Nutr_No from nutr_def where NutrDesc = 'Calcium, Ca'), 1, 3, 'F', 'RDA', 700),
((select Nutr_No from nutr_def where NutrDesc = 'Calcium, Ca'), 1, 3, 'M', 'RDA', 700),
((select Nutr_No from nutr_def where NutrDesc = 'Calcium, Ca'), 4, 8, 'F', 'RDA', 1000),
((select Nutr_No from nutr_def where NutrDesc = 'Calcium, Ca'), 4, 8, 'M', 'RDA', 1000),
((select Nutr_No from nutr_def where NutrDesc = 'Calcium, Ca'), 9, 13, 'F', 'RDA', 1300),
((select Nutr_No from nutr_def where NutrDesc = 'Calcium, Ca'), 9, 13, 'M', 'RDA', 1300),
((select Nutr_No from nutr_def where NutrDesc = 'Calcium, Ca'), 14, 18, 'F', 'RDA', 1300),
((select Nutr_No from nutr_def where NutrDesc = 'Calcium, Ca'), 14, 18, 'M', 'RDA', 1300),
((select Nutr_No from nutr_def where NutrDesc = 'Calcium, Ca'), 19, 30, 'F', 'RDA', 1000),
((select Nutr_No from nutr_def where NutrDesc = 'Calcium, Ca'), 19, 30, 'M', 'RDA', 1000),
((select Nutr_No from nutr_def where NutrDesc = 'Calcium, Ca'), 31, 50, 'F', 'RDA', 1000),
((select Nutr_No from nutr_def where NutrDesc = 'Calcium, Ca'), 31, 50, 'M', 'RDA', 1000),
((select Nutr_No from nutr_def where NutrDesc = 'Calcium, Ca'), 51, 150, 'F', 'RDA', 1200),
((select Nutr_No from nutr_def where NutrDesc = 'Calcium, Ca'), 51, 70, 'M', 'RDA', 1000),
((select Nutr_No from nutr_def where NutrDesc = 'Calcium, Ca'), 71, 150, 'M', 'RDA', 1200);

insert into rdi (nutr_no, age_min, age_max, gender, type, value) values
((select Nutr_No from nutr_def where NutrDesc = 'Iron, Fe'), 1, 3, 'F', 'RDA', 7),
((select Nutr_No from nutr_def where NutrDesc = 'Iron, Fe'), 1, 3, 'M', 'RDA', 7),
((select Nutr_No from nutr_def where NutrDesc = 'Iron, Fe'), 4, 8, 'F', 'RDA', 10),
((select Nutr_No from nutr_def where NutrDesc = 'Iron, Fe'), 4, 8, 'M', 'RDA', 10),
((select Nutr_No from nutr_def where NutrDesc = 'Iron, Fe'), 9, 13, 'F', 'RDA', 8),
((select Nutr_No from nutr_def where NutrDesc = 'Iron, Fe'), 9, 13, 'M', 'RDA', 8),
((select Nutr_No from nutr_def where NutrDesc = 'Iron, Fe'), 14, 18, 'F', 'RDA', 15),
((select Nutr_No from nutr_def where NutrDesc = 'Iron, Fe'), 14, 18, 'M', 'RDA', 11),
((select Nutr_No from nutr_def where NutrDesc = 'Iron, Fe'), 19, 30, 'F', 'RDA', 18),
((select Nutr_No from nutr_def where NutrDesc = 'Iron, Fe'), 19, 30, 'M', 'RDA', 8),
((select Nutr_No from nutr_def where NutrDesc = 'Iron, Fe'), 31, 50, 'F', 'RDA', 18),
((select Nutr_No from nutr_def where NutrDesc = 'Iron, Fe'), 31, 50, 'M', 'RDA', 8),
((select Nutr_No from nutr_def where NutrDesc = 'Iron, Fe'), 51, 150, 'F', 'RDA', 8),
((select Nutr_No from nutr_def where NutrDesc = 'Iron, Fe'), 51, 150, 'M', 'RDA', 8);

insert into rdi (nutr_no, age_min, age_max, gender, type, value) values
((select Nutr_No from nutr_def where NutrDesc = 'Magnesium, Mg'), 1, 3, 'F', 'RDA', 80),
((select Nutr_No from nutr_def where NutrDesc = 'Magnesium, Mg'), 1, 3, 'M', 'RDA', 80),
((select Nutr_No from nutr_def where NutrDesc = 'Magnesium, Mg'), 4, 8, 'F', 'RDA', 130),
((select Nutr_No from nutr_def where NutrDesc = 'Magnesium, Mg'), 4, 8, 'M', 'RDA', 130),
((select Nutr_No from nutr_def where NutrDesc = 'Magnesium, Mg'), 9, 13, 'F', 'RDA', 240),
((select Nutr_No from nutr_def where NutrDesc = 'Magnesium, Mg'), 9, 13, 'M', 'RDA', 240),
((select Nutr_No from nutr_def where NutrDesc = 'Magnesium, Mg'), 14, 18, 'F', 'RDA', 360),
((select Nutr_No from nutr_def where NutrDesc = 'Magnesium, Mg'), 14, 18, 'M', 'RDA', 410),
((select Nutr_No from nutr_def where NutrDesc = 'Magnesium, Mg'), 19, 30, 'F', 'RDA', 310),
((select Nutr_No from nutr_def where NutrDesc = 'Magnesium, Mg'), 19, 30, 'M', 'RDA', 400),
((select Nutr_No from nutr_def where NutrDesc = 'Magnesium, Mg'), 31, 50, 'F', 'RDA', 320),
((select Nutr_No from nutr_def where NutrDesc = 'Magnesium, Mg'), 31, 50, 'M', 'RDA', 420),
((select Nutr_No from nutr_def where NutrDesc = 'Magnesium, Mg'), 51, 150, 'F', 'RDA', 320),
((select Nutr_No from nutr_def where NutrDesc = 'Magnesium, Mg'), 51, 150, 'M', 'RDA', 420);

insert into rdi (nutr_no, age_min, age_max, gender, type, value) values
((select Nutr_No from nutr_def where NutrDesc = 'Phosphorus, P'), 1, 3, 'F', 'RDA', 460),
((select Nutr_No from nutr_def where NutrDesc = 'Phosphorus, P'), 1, 3, 'M', 'RDA', 460),
((select Nutr_No from nutr_def where NutrDesc = 'Phosphorus, P'), 4, 8, 'F', 'RDA', 500),
((select Nutr_No from nutr_def where NutrDesc = 'Phosphorus, P'), 4, 8, 'M', 'RDA', 500),
((select Nutr_No from nutr_def where NutrDesc = 'Phosphorus, P'), 9, 13, 'F', 'RDA', 1250),
((select Nutr_No from nutr_def where NutrDesc = 'Phosphorus, P'), 9, 13, 'M', 'RDA', 1250),
((select Nutr_No from nutr_def where NutrDesc = 'Phosphorus, P'), 14, 18, 'F', 'RDA', 1250),
((select Nutr_No from nutr_def where NutrDesc = 'Phosphorus, P'), 14, 18, 'M', 'RDA', 1250),
((select Nutr_No from nutr_def where NutrDesc = 'Phosphorus, P'), 19, 30, 'F', 'RDA', 700),
((select Nutr_No from nutr_def where NutrDesc = 'Phosphorus, P'), 19, 30, 'M', 'RDA', 700),
((select Nutr_No from nutr_def where NutrDesc = 'Phosphorus, P'), 31, 50, 'F', 'RDA', 700),
((select Nutr_No from nutr_def where NutrDesc = 'Phosphorus, P'), 31, 50, 'M', 'RDA', 700),
((select Nutr_No from nutr_def where NutrDesc = 'Phosphorus, P'), 51, 150, 'F', 'RDA', 700),
((select Nutr_No from nutr_def where NutrDesc = 'Phosphorus, P'), 51, 150, 'M', 'RDA', 700);

insert into rdi (nutr_no, age_min, age_max, gender, type, value) values
((select Nutr_No from nutr_def where NutrDesc = 'Potassium, K'), 1, 3, 'F', 'AI', 3000),
((select Nutr_No from nutr_def where NutrDesc = 'Potassium, K'), 1, 3, 'M', 'AI', 3000),
((select Nutr_No from nutr_def where NutrDesc = 'Potassium, K'), 4, 8, 'F', 'AI', 3800),
((select Nutr_No from nutr_def where NutrDesc = 'Potassium, K'), 4, 8, 'M', 'AI', 3800),
((select Nutr_No from nutr_def where NutrDesc = 'Potassium, K'), 9, 13, 'F', 'AI', 4500),
((select Nutr_No from nutr_def where NutrDesc = 'Potassium, K'), 9, 13, 'M', 'AI', 4500),
((select Nutr_No from nutr_def where NutrDesc = 'Potassium, K'), 14, 18, 'F', 'AI', 4700),
((select Nutr_No from nutr_def where NutrDesc = 'Potassium, K'), 14, 18, 'M', 'AI', 4700),
((select Nutr_No from nutr_def where NutrDesc = 'Potassium, K'), 19, 30, 'F', 'AI', 4700),
((select Nutr_No from nutr_def where NutrDesc = 'Potassium, K'), 19, 30, 'M', 'AI', 4700),
((select Nutr_No from nutr_def where NutrDesc = 'Potassium, K'), 31, 50, 'F', 'AI', 4700),
((select Nutr_No from nutr_def where NutrDesc = 'Potassium, K'), 31, 50, 'M', 'AI', 4700),
((select Nutr_No from nutr_def where NutrDesc = 'Potassium, K'), 51, 150, 'F', 'AI', 4700),
((select Nutr_No from nutr_def where NutrDesc = 'Potassium, K'), 51, 150, 'M', 'AI', 4700);

insert into rdi (nutr_no, age_min, age_max, gender, type, value) values
((select Nutr_No from nutr_def where NutrDesc = 'Sodium, Na'), 1, 3, 'F', 'UL', 1500),
((select Nutr_No from nutr_def where NutrDesc = 'Sodium, Na'), 1, 3, 'M', 'UL', 1500),
((select Nutr_No from nutr_def where NutrDesc = 'Sodium, Na'), 4, 8, 'F', 'UL', 1900),
((select Nutr_No from nutr_def where NutrDesc = 'Sodium, Na'), 4, 8, 'M', 'UL', 1900),
((select Nutr_No from nutr_def where NutrDesc = 'Sodium, Na'), 9, 13, 'F', 'UL', 2200),
((select Nutr_No from nutr_def where NutrDesc = 'Sodium, Na'), 9, 13, 'M', 'UL', 2200),
((select Nutr_No from nutr_def where NutrDesc = 'Sodium, Na'), 14, 18, 'F', 'UL', 2300),
((select Nutr_No from nutr_def where NutrDesc = 'Sodium, Na'), 14, 18, 'M', 'UL', 2300),
((select Nutr_No from nutr_def where NutrDesc = 'Sodium, Na'), 19, 30, 'F', 'UL', 2300),
((select Nutr_No from nutr_def where NutrDesc = 'Sodium, Na'), 19, 30, 'M', 'UL', 2300),
((select Nutr_No from nutr_def where NutrDesc = 'Sodium, Na'), 31, 50, 'F', 'UL', 2300),
((select Nutr_No from nutr_def where NutrDesc = 'Sodium, Na'), 31, 50, 'M', 'UL', 2300),
((select Nutr_No from nutr_def where NutrDesc = 'Sodium, Na'), 51, 150, 'F', 'UL', 2300),
((select Nutr_No from nutr_def where NutrDesc = 'Sodium, Na'), 51, 150, 'M', 'UL', 2300);

insert into rdi (nutr_no, age_min, age_max, gender, type, value) values
((select Nutr_No from nutr_def where NutrDesc = 'Zinc, Zn'), 1, 3, 'F', 'RDA', 3),
((select Nutr_No from nutr_def where NutrDesc = 'Zinc, Zn'), 1, 3, 'M', 'RDA', 3),
((select Nutr_No from nutr_def where NutrDesc = 'Zinc, Zn'), 4, 8, 'F', 'RDA', 5),
((select Nutr_No from nutr_def where NutrDesc = 'Zinc, Zn'), 4, 8, 'M', 'RDA', 5),
((select Nutr_No from nutr_def where NutrDesc = 'Zinc, Zn'), 9, 13, 'F', 'RDA', 8),
((select Nutr_No from nutr_def where NutrDesc = 'Zinc, Zn'), 9, 13, 'M', 'RDA', 8),
((select Nutr_No from nutr_def where NutrDesc = 'Zinc, Zn'), 14, 18, 'F', 'RDA', 9),
((select Nutr_No from nutr_def where NutrDesc = 'Zinc, Zn'), 14, 18, 'M', 'RDA', 11),
((select Nutr_No from nutr_def where NutrDesc = 'Zinc, Zn'), 19, 30, 'F', 'RDA', 8),
((select Nutr_No from nutr_def where NutrDesc = 'Zinc, Zn'), 19, 30, 'M', 'RDA', 11),
((select Nutr_No from nutr_def where NutrDesc = 'Zinc, Zn'), 31, 50, 'F', 'RDA', 8),
((select Nutr_No from nutr_def where NutrDesc = 'Zinc, Zn'), 31, 50, 'M', 'RDA', 11),
((select Nutr_No from nutr_def where NutrDesc = 'Zinc, Zn'), 51, 150, 'F', 'RDA', 8),
((select Nutr_No from nutr_def where NutrDesc = 'Zinc, Zn'), 51, 150, 'M', 'RDA', 11);

insert into rdi (nutr_no, age_min, age_max, gender, type, value) values
((select Nutr_No from nutr_def where NutrDesc = 'Copper, Cu'), 1, 3, 'F', 'RDA', 0.34),
((select Nutr_No from nutr_def where NutrDesc = 'Copper, Cu'), 1, 3, 'M', 'RDA', 0.34),
((select Nutr_No from nutr_def where NutrDesc = 'Copper, Cu'), 4, 8, 'F', 'RDA', 0.44),
((select Nutr_No from nutr_def where NutrDesc = 'Copper, Cu'), 4, 8, 'M', 'RDA', 0.44),
((select Nutr_No from nutr_def where NutrDesc = 'Copper, Cu'), 9, 13, 'F', 'RDA', 0.7),
((select Nutr_No from nutr_def where NutrDesc = 'Copper, Cu'), 9, 13, 'M', 'RDA', 0.7),
((select Nutr_No from nutr_def where NutrDesc = 'Copper, Cu'), 14, 18, 'F', 'RDA', 0.89),
((select Nutr_No from nutr_def where NutrDesc = 'Copper, Cu'), 14, 18, 'M', 'RDA', 0.89),
((select Nutr_No from nutr_def where NutrDesc = 'Copper, Cu'), 19, 30, 'F', 'RDA', 0.9),
((select Nutr_No from nutr_def where NutrDesc = 'Copper, Cu'), 19, 30, 'M', 'RDA', 0.9),
((select Nutr_No from nutr_def where NutrDesc = 'Copper, Cu'), 31, 50, 'F', 'RDA', 0.9),
((select Nutr_No from nutr_def where NutrDesc = 'Copper, Cu'), 31, 50, 'M', 'RDA', 0.9),
((select Nutr_No from nutr_def where NutrDesc = 'Copper, Cu'), 51, 150, 'F', 'RDA', 0.9),
((select Nutr_No from nutr_def where NutrDesc = 'Copper, Cu'), 51, 150, 'M', 'RDA', 0.9);

insert into rdi (nutr_no, age_min, age_max, gender, type, value) values
((select Nutr_No from nutr_def where NutrDesc = 'Manganese, Mn'), 1, 3, 'F', 'AI', 1.2),
((select Nutr_No from nutr_def where NutrDesc = 'Manganese, Mn'), 1, 3, 'M', 'AI', 1.2),
((select Nutr_No from nutr_def where NutrDesc = 'Manganese, Mn'), 4, 8, 'F', 'AI', 1.5),
((select Nutr_No from nutr_def where NutrDesc = 'Manganese, Mn'), 4, 8, 'M', 'AI', 1.5),
((select Nutr_No from nutr_def where NutrDesc = 'Manganese, Mn'), 9, 13, 'F', 'AI', 1.6),
((select Nutr_No from nutr_def where NutrDesc = 'Manganese, Mn'), 9, 13, 'M', 'AI', 1.9),
((select Nutr_No from nutr_def where NutrDesc = 'Manganese, Mn'), 14, 18, 'F', 'AI', 1.6),
((select Nutr_No from nutr_def where NutrDesc = 'Manganese, Mn'), 14, 18, 'M', 'AI', 2.2),
((select Nutr_No from nutr_def where NutrDesc = 'Manganese, Mn'), 19, 30, 'F', 'AI', 1.8),
((select Nutr_No from nutr_def where NutrDesc = 'Manganese, Mn'), 19, 30, 'M', 'AI', 2.3),
((select Nutr_No from nutr_def where NutrDesc = 'Manganese, Mn'), 31, 50, 'F', 'AI', 1.8),
((select Nutr_No from nutr_def where NutrDesc = 'Manganese, Mn'), 31, 50, 'M', 'AI', 2.3),
((select Nutr_No from nutr_def where NutrDesc = 'Manganese, Mn'), 51, 150, 'F', 'AI', 1.8),
((select Nutr_No from nutr_def where NutrDesc = 'Manganese, Mn'), 51, 150, 'M', 'AI', 2.3);

insert into rdi (nutr_no, age_min, age_max, gender, type, value) values
((select Nutr_No from nutr_def where NutrDesc = 'Selenium, Se'), 1, 3, 'F', 'RDA', 20),
((select Nutr_No from nutr_def where NutrDesc = 'Selenium, Se'), 1, 3, 'M', 'RDA', 20),
((select Nutr_No from nutr_def where NutrDesc = 'Selenium, Se'), 4, 8, 'F', 'RDA', 30),
((select Nutr_No from nutr_def where NutrDesc = 'Selenium, Se'), 4, 8, 'M', 'RDA', 30),
((select Nutr_No from nutr_def where NutrDesc = 'Selenium, Se'), 9, 13, 'F', 'RDA', 40),
((select Nutr_No from nutr_def where NutrDesc = 'Selenium, Se'), 9, 13, 'M', 'RDA', 40),
((select Nutr_No from nutr_def where NutrDesc = 'Selenium, Se'), 14, 18, 'F', 'RDA', 55),
((select Nutr_No from nutr_def where NutrDesc = 'Selenium, Se'), 14, 18, 'M', 'RDA', 55),
((select Nutr_No from nutr_def where NutrDesc = 'Selenium, Se'), 19, 30, 'F', 'RDA', 55),
((select Nutr_No from nutr_def where NutrDesc = 'Selenium, Se'), 19, 30, 'M', 'RDA', 55),
((select Nutr_No from nutr_def where NutrDesc = 'Selenium, Se'), 31, 50, 'F', 'RDA', 55),
((select Nutr_No from nutr_def where NutrDesc = 'Selenium, Se'), 31, 50, 'M', 'RDA', 55),
((select Nutr_No from nutr_def where NutrDesc = 'Selenium, Se'), 51, 150, 'F', 'RDA', 55),
((select Nutr_No from nutr_def where NutrDesc = 'Selenium, Se'), 51, 150, 'M', 'RDA', 55);

insert into rdi (nutr_no, age_min, age_max, gender, type, value) values
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin A, RAE'), 1, 3, 'F', 'RDA', 300),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin A, RAE'), 1, 3, 'M', 'RDA', 300),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin A, RAE'), 4, 8, 'F', 'RDA', 400),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin A, RAE'), 4, 8, 'M', 'RDA', 400),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin A, RAE'), 9, 13, 'F', 'RDA', 600),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin A, RAE'), 9, 13, 'M', 'RDA', 600),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin A, RAE'), 14, 18, 'F', 'RDA', 700),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin A, RAE'), 14, 18, 'M', 'RDA', 900),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin A, RAE'), 19, 30, 'F', 'RDA', 700),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin A, RAE'), 19, 30, 'M', 'RDA', 900),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin A, RAE'), 31, 50, 'F', 'RDA', 700),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin A, RAE'), 31, 50, 'M', 'RDA', 900),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin A, RAE'), 51, 150, 'F', 'RDA', 700),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin A, RAE'), 51, 150, 'M', 'RDA', 900);

insert into rdi (nutr_no, age_min, age_max, gender, type, value) values
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin E (alpha-tocopherol)'), 1, 3, 'F', 'RDA', 6),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin E (alpha-tocopherol)'), 1, 3, 'M', 'RDA', 6),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin E (alpha-tocopherol)'), 4, 8, 'F', 'RDA', 7),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin E (alpha-tocopherol)'), 4, 8, 'M', 'RDA', 7),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin E (alpha-tocopherol)'), 9, 13, 'F', 'RDA', 11),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin E (alpha-tocopherol)'), 9, 13, 'M', 'RDA', 11),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin E (alpha-tocopherol)'), 14, 18, 'F', 'RDA', 15),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin E (alpha-tocopherol)'), 14, 18, 'M', 'RDA', 15),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin E (alpha-tocopherol)'), 19, 30, 'F', 'RDA', 15),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin E (alpha-tocopherol)'), 19, 30, 'M', 'RDA', 15),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin E (alpha-tocopherol)'), 31, 50, 'F', 'RDA', 15),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin E (alpha-tocopherol)'), 31, 50, 'M', 'RDA', 15),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin E (alpha-tocopherol)'), 51, 150, 'F', 'RDA', 15),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin E (alpha-tocopherol)'), 51, 150, 'M', 'RDA', 15);

insert into rdi (nutr_no, age_min, age_max, gender, type, value) values
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin D'), 1, 70, 'F', 'RDA', 600),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin D'), 1, 70, 'M', 'RDA', 600),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin D'), 71, 150, 'F', 'RDA', 800),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin D'), 71, 150, 'M', 'RDA', 800);

insert into rdi (nutr_no, age_min, age_max, gender, type, value) values
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin C, total ascorbic acid'), 1, 3, 'F', 'RDA', 15),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin C, total ascorbic acid'), 1, 3, 'M', 'RDA', 15),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin C, total ascorbic acid'), 4, 8, 'F', 'RDA', 25),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin C, total ascorbic acid'), 4, 8, 'M', 'RDA', 25),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin C, total ascorbic acid'), 9, 13, 'F', 'RDA', 45),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin C, total ascorbic acid'), 9, 13, 'M', 'RDA', 45),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin C, total ascorbic acid'), 14, 18, 'F', 'RDA', 65),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin C, total ascorbic acid'), 14, 18, 'M', 'RDA', 75),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin C, total ascorbic acid'), 19, 30, 'F', 'RDA', 75),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin C, total ascorbic acid'), 19, 30, 'M', 'RDA', 90),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin C, total ascorbic acid'), 31, 50, 'F', 'RDA', 75),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin C, total ascorbic acid'), 31, 50, 'M', 'RDA', 90),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin C, total ascorbic acid'), 51, 150, 'F', 'RDA', 75),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin C, total ascorbic acid'), 51, 150, 'M', 'RDA', 90);

insert into rdi (nutr_no, age_min, age_max, gender, type, value) values
((select Nutr_No from nutr_def where NutrDesc = 'Thiamin'), 1, 3, 'F', 'RDA', 0.5),
((select Nutr_No from nutr_def where NutrDesc = 'Thiamin'), 1, 3, 'M', 'RDA', 0.5),
((select Nutr_No from nutr_def where NutrDesc = 'Thiamin'), 4, 8, 'F', 'RDA', 0.6),
((select Nutr_No from nutr_def where NutrDesc = 'Thiamin'), 4, 8, 'M', 'RDA', 0.6),
((select Nutr_No from nutr_def where NutrDesc = 'Thiamin'), 9, 13, 'F', 'RDA', 0.9),
((select Nutr_No from nutr_def where NutrDesc = 'Thiamin'), 9, 13, 'M', 'RDA', 0.9),
((select Nutr_No from nutr_def where NutrDesc = 'Thiamin'), 14, 18, 'F', 'RDA', 1),
((select Nutr_No from nutr_def where NutrDesc = 'Thiamin'), 14, 18, 'M', 'RDA', 1.2),
((select Nutr_No from nutr_def where NutrDesc = 'Thiamin'), 19, 30, 'F', 'RDA', 1.1),
((select Nutr_No from nutr_def where NutrDesc = 'Thiamin'), 19, 30, 'M', 'RDA', 1.2),
((select Nutr_No from nutr_def where NutrDesc = 'Thiamin'), 31, 50, 'F', 'RDA', 1.1),
((select Nutr_No from nutr_def where NutrDesc = 'Thiamin'), 31, 50, 'M', 'RDA', 1.2),
((select Nutr_No from nutr_def where NutrDesc = 'Thiamin'), 51, 150, 'F', 'RDA', 1.1),
((select Nutr_No from nutr_def where NutrDesc = 'Thiamin'), 51, 150, 'M', 'RDA', 1.2);

insert into rdi (nutr_no, age_min, age_max, gender, type, value) values
((select Nutr_No from nutr_def where NutrDesc = 'Riboflavin'), 1, 3, 'F', 'RDA', 0.5),
((select Nutr_No from nutr_def where NutrDesc = 'Riboflavin'), 1, 3, 'M', 'RDA', 0.5),
((select Nutr_No from nutr_def where NutrDesc = 'Riboflavin'), 4, 8, 'F', 'RDA', 0.6),
((select Nutr_No from nutr_def where NutrDesc = 'Riboflavin'), 4, 8, 'M', 'RDA', 0.6),
((select Nutr_No from nutr_def where NutrDesc = 'Riboflavin'), 9, 13, 'F', 'RDA', 0.9),
((select Nutr_No from nutr_def where NutrDesc = 'Riboflavin'), 9, 13, 'M', 'RDA', 0.9),
((select Nutr_No from nutr_def where NutrDesc = 'Riboflavin'), 14, 18, 'F', 'RDA', 1),
((select Nutr_No from nutr_def where NutrDesc = 'Riboflavin'), 14, 18, 'M', 'RDA', 1.3),
((select Nutr_No from nutr_def where NutrDesc = 'Riboflavin'), 19, 30, 'F', 'RDA', 1.1),
((select Nutr_No from nutr_def where NutrDesc = 'Riboflavin'), 19, 30, 'M', 'RDA', 1.3),
((select Nutr_No from nutr_def where NutrDesc = 'Riboflavin'), 31, 50, 'F', 'RDA', 1.1),
((select Nutr_No from nutr_def where NutrDesc = 'Riboflavin'), 31, 50, 'M', 'RDA', 1.3),
((select Nutr_No from nutr_def where NutrDesc = 'Riboflavin'), 51, 150, 'F', 'RDA', 1.1),
((select Nutr_No from nutr_def where NutrDesc = 'Riboflavin'), 51, 150, 'M', 'RDA', 1.3);

insert into rdi (nutr_no, age_min, age_max, gender, type, value) values
((select Nutr_No from nutr_def where NutrDesc = 'Niacin'), 1, 3, 'F', 'RDA', 6),
((select Nutr_No from nutr_def where NutrDesc = 'Niacin'), 1, 3, 'M', 'RDA', 6),
((select Nutr_No from nutr_def where NutrDesc = 'Niacin'), 4, 8, 'F', 'RDA', 8),
((select Nutr_No from nutr_def where NutrDesc = 'Niacin'), 4, 8, 'M', 'RDA', 8),
((select Nutr_No from nutr_def where NutrDesc = 'Niacin'), 9, 13, 'F', 'RDA', 12),
((select Nutr_No from nutr_def where NutrDesc = 'Niacin'), 9, 13, 'M', 'RDA', 12),
((select Nutr_No from nutr_def where NutrDesc = 'Niacin'), 14, 18, 'F', 'RDA', 14),
((select Nutr_No from nutr_def where NutrDesc = 'Niacin'), 14, 18, 'M', 'RDA', 16),
((select Nutr_No from nutr_def where NutrDesc = 'Niacin'), 19, 30, 'F', 'RDA', 14),
((select Nutr_No from nutr_def where NutrDesc = 'Niacin'), 19, 30, 'M', 'RDA', 16),
((select Nutr_No from nutr_def where NutrDesc = 'Niacin'), 31, 50, 'F', 'RDA', 14),
((select Nutr_No from nutr_def where NutrDesc = 'Niacin'), 31, 50, 'M', 'RDA', 16),
((select Nutr_No from nutr_def where NutrDesc = 'Niacin'), 51, 150, 'F', 'RDA', 14),
((select Nutr_No from nutr_def where NutrDesc = 'Niacin'), 51, 150, 'M', 'RDA', 16);

insert into rdi (nutr_no, age_min, age_max, gender, type, value) values
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin B-6'), 1, 3, 'F', 'RDA', 0.5),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin B-6'), 1, 3, 'M', 'RDA', 0.5),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin B-6'), 4, 8, 'F', 'RDA', 0.6),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin B-6'), 4, 8, 'M', 'RDA', 0.6),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin B-6'), 9, 13, 'F', 'RDA', 1),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin B-6'), 9, 13, 'M', 'RDA', 1),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin B-6'), 14, 18, 'F', 'RDA', 1.2),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin B-6'), 14, 18, 'M', 'RDA', 1.3),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin B-6'), 19, 30, 'F', 'RDA', 1.3),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin B-6'), 19, 30, 'M', 'RDA', 1.3),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin B-6'), 31, 50, 'F', 'RDA', 1.3),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin B-6'), 31, 50, 'M', 'RDA', 1.3),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin B-6'), 51, 150, 'F', 'RDA', 1.5),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin B-6'), 51, 150, 'M', 'RDA', 1.7);

insert into rdi (nutr_no, age_min, age_max, gender, type, value) values
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin B-12'), 1, 3, 'F', 'RDA', 0.9),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin B-12'), 1, 3, 'M', 'RDA', 0.9),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin B-12'), 4, 8, 'F', 'RDA', 1.2),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin B-12'), 4, 8, 'M', 'RDA', 1.2),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin B-12'), 9, 13, 'F', 'RDA', 1.8),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin B-12'), 9, 13, 'M', 'RDA', 1.8),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin B-12'), 14, 18, 'F', 'RDA', 2.4),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin B-12'), 14, 18, 'M', 'RDA', 2.4),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin B-12'), 19, 30, 'F', 'RDA', 2.4),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin B-12'), 19, 30, 'M', 'RDA', 2.4),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin B-12'), 31, 50, 'F', 'RDA', 2.4),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin B-12'), 31, 50, 'M', 'RDA', 2.4),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin B-12'), 51, 150, 'F', 'RDA', 2.4),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin B-12'), 51, 150, 'M', 'RDA', 2.4);

insert into rdi (nutr_no, age_min, age_max, gender, type, value) values
((select Nutr_No from nutr_def where NutrDesc = 'Choline, total'), 1, 3, 'F', 'AI', 200),
((select Nutr_No from nutr_def where NutrDesc = 'Choline, total'), 1, 3, 'M', 'AI', 200),
((select Nutr_No from nutr_def where NutrDesc = 'Choline, total'), 4, 8, 'F', 'AI', 250),
((select Nutr_No from nutr_def where NutrDesc = 'Choline, total'), 4, 8, 'M', 'AI', 250),
((select Nutr_No from nutr_def where NutrDesc = 'Choline, total'), 9, 13, 'F', 'AI', 375),
((select Nutr_No from nutr_def where NutrDesc = 'Choline, total'), 9, 13, 'M', 'AI', 375),
((select Nutr_No from nutr_def where NutrDesc = 'Choline, total'), 14, 18, 'F', 'AI', 400),
((select Nutr_No from nutr_def where NutrDesc = 'Choline, total'), 14, 18, 'M', 'AI', 550),
((select Nutr_No from nutr_def where NutrDesc = 'Choline, total'), 19, 30, 'F', 'AI', 425),
((select Nutr_No from nutr_def where NutrDesc = 'Choline, total'), 19, 30, 'M', 'AI', 550),
((select Nutr_No from nutr_def where NutrDesc = 'Choline, total'), 31, 50, 'F', 'AI', 425),
((select Nutr_No from nutr_def where NutrDesc = 'Choline, total'), 31, 50, 'M', 'AI', 550),
((select Nutr_No from nutr_def where NutrDesc = 'Choline, total'), 51, 150, 'F', 'AI', 425),
((select Nutr_No from nutr_def where NutrDesc = 'Choline, total'), 51, 150, 'M', 'AI', 550);

insert into rdi (nutr_no, age_min, age_max, gender, type, value) values
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin K (phylloquinone)'), 1, 3, 'F', 'AI', 30),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin K (phylloquinone)'), 1, 3, 'M', 'AI', 30),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin K (phylloquinone)'), 4, 8, 'F', 'AI', 55),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin K (phylloquinone)'), 4, 8, 'M', 'AI', 55),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin K (phylloquinone)'), 9, 13, 'F', 'AI', 60),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin K (phylloquinone)'), 9, 13, 'M', 'AI', 60),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin K (phylloquinone)'), 14, 18, 'F', 'AI', 75),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin K (phylloquinone)'), 14, 18, 'M', 'AI', 75),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin K (phylloquinone)'), 19, 30, 'F', 'AI', 90),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin K (phylloquinone)'), 19, 30, 'M', 'AI', 120),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin K (phylloquinone)'), 31, 50, 'F', 'AI', 90),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin K (phylloquinone)'), 31, 50, 'M', 'AI', 120),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin K (phylloquinone)'), 51, 150, 'F', 'AI', 90),
((select Nutr_No from nutr_def where NutrDesc = 'Vitamin K (phylloquinone)'), 51, 150, 'M', 'AI', 120);

insert into rdi (nutr_no, age_min, age_max, gender, type, value) values
((select Nutr_No from nutr_def where NutrDesc = 'Folate, DFE'), 1, 3, 'F', 'RDA', 150),
((select Nutr_No from nutr_def where NutrDesc = 'Folate, DFE'), 1, 3, 'M', 'RDA', 150),
((select Nutr_No from nutr_def where NutrDesc = 'Folate, DFE'), 4, 8, 'F', 'RDA', 200),
((select Nutr_No from nutr_def where NutrDesc = 'Folate, DFE'), 4, 8, 'M', 'RDA', 200),
((select Nutr_No from nutr_def where NutrDesc = 'Folate, DFE'), 9, 13, 'F', 'RDA', 300),
((select Nutr_No from nutr_def where NutrDesc = 'Folate, DFE'), 9, 13, 'M', 'RDA', 300),
((select Nutr_No from nutr_def where NutrDesc = 'Folate, DFE'), 14, 18, 'F', 'RDA', 400),
((select Nutr_No from nutr_def where NutrDesc = 'Folate, DFE'), 14, 18, 'M', 'RDA', 400),
((select Nutr_No from nutr_def where NutrDesc = 'Folate, DFE'), 19, 30, 'F', 'RDA', 400),
((select Nutr_No from nutr_def where NutrDesc = 'Folate, DFE'), 19, 30, 'M', 'RDA', 400),
((select Nutr_No from nutr_def where NutrDesc = 'Folate, DFE'), 31, 50, 'F', 'RDA', 400),
((select Nutr_No from nutr_def where NutrDesc = 'Folate, DFE'), 31, 50, 'M', 'RDA', 400),
((select Nutr_No from nutr_def where NutrDesc = 'Folate, DFE'), 51, 150, 'F', 'RDA', 400),
((select Nutr_No from nutr_def where NutrDesc = 'Folate, DFE'), 51, 150, 'M', 'RDA', 400);

commit;
