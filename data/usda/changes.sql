create table rdi (
    id        int auto_increment primary key,
    nutr_no   char(3) not null,
    age_min   int unsigned not null,
    age_max   int unsigned not null,
    genre     char(1) not null,
    pregnancy char(1) not null default 'N',
    lactation char(1) not null default 'N',

    constraint uk_rdi_all unique (nutr_no, age_min, age_max, genre, pregnancy, lactation),
    constraint fk_rdi_nutr_def foreign key (nutr_no) references nutr_def(nutr_no),
    constraint chk_rdi_age check (age_min < age_max),
    constraint chk_rdi_age_min check (age_min > 0 and age_min < 150),
    constraint chk_rdi_age_max check (age_max > 0 and age_max < 150),
    constraint chk_rdi_genre check (genre in ('M', 'F')),
    constraint chk_rdi_pregnancy check (pregnancy in ('Y', 'N')),
    constraint chk_rdi_lactation check (lactation in ('Y', 'N')),
    constraint chk_rdi_pregnancy_women check (pregnancy = 'N' or (pregnancy = 'Y' and genre = 'F')),
    constraint chk_rdi_lactation_women check (lactation = 'N' or (lactation = 'Y' and genre = 'F'))
);
