insert into usda_categories (usda_id, name, is_visible_default, color)
select
    fdgrp_cd,
    fdgrp_desc,
    fdgrp_desc not in (
        'Beef Products',
        'Dairy and Egg Products',
        'Finfish and Shellfish Products',
        'Lamb, Veal, and Game Products',
        'Pork Products',
        'Poultry Products',
        'Sausages and Luncheon Meats'
    ),
    case
        when fdgrp_desc = 'American Indian/Alaska Native Foods' then '#ffa210'
        when fdgrp_desc = 'Baby Foods' then '#feadfa'
        when fdgrp_desc = 'Baked Products' then '#dc9c5e'
        when fdgrp_desc = 'Beef Products' then '#e33b17'
        when fdgrp_desc = 'Beverages' then '#52ace3'
        when fdgrp_desc = 'Breakfast Cereals' then '#85403b'
        when fdgrp_desc = 'Cereal Grains and Pasta' then '#f1b54d'
        when fdgrp_desc = 'Dairy and Egg Products' then '#f4f4f4'
        when fdgrp_desc = 'Fast Foods' then '#eb0001'
        when fdgrp_desc = 'Fats and Oils' then '#cec409'
        when fdgrp_desc = 'Finfish and Shellfish Products' then '#5e88a2'
        when fdgrp_desc = 'Fruits and Fruit Juices' then '#f79f09'
        when fdgrp_desc = 'Lamb, Veal, and Game Products' then '#d55e60'
        when fdgrp_desc = 'Legumes and Legume Products' then '#752242'
        when fdgrp_desc = 'Meals, Entrees, and Side Dishes' then '#f7eba1'
        when fdgrp_desc = 'Nut and Seed Products' then '#c37d41'
        when fdgrp_desc = 'Pork Products' then '#b62847'
        when fdgrp_desc = 'Poultry Products' then '#d59c5c'
        when fdgrp_desc = 'Restaurant Foods' then '#273875'
        when fdgrp_desc = 'Sausages and Luncheon Meats' then '#e76b1d'
        when fdgrp_desc = 'Snacks' then '#b99460'
        when fdgrp_desc = 'Soups, Sauces, and Gravies' then '#ffc640'
        when fdgrp_desc = 'Spices and Herbs' then '#5fb356'
        when fdgrp_desc = 'Sweets' then '#ffade3'
        when fdgrp_desc = 'Vegetables and Vegetable Products' then '#4b7007'
    end
from usda.fd_group;

insert into nutrients (name, unit_id, is_essential, is_visible_default, category_id, source_id, external_id) values
('Chloride, Cl-',  (select u.id from units u where u.abbr = 'g'), false, false, (select c.id from nutrient_categories c where c.name = 'Minerals'), (select s.id from data_sources s where s.name = 'Wikipedia'), 'Chloride'),
('Chromium, Cr',   (select u.id from units u where u.abbr = 'µg'), true, false, (select c.id from nutrient_categories c where c.name = 'Minerals'), (select s.id from data_sources s where s.name = 'Wikipedia'), 'Chromium'),
('Iodine, I',      (select u.id from units u where u.abbr = 'µg'), true, false, (select c.id from nutrient_categories c where c.name = 'Minerals'), (select s.id from data_sources s where s.name = 'Wikipedia'), 'Iodine'),
('Molybdenum, Mo', (select u.id from units u where u.abbr = 'µg'), true, false, (select c.id from nutrient_categories c where c.name = 'Minerals'), (select s.id from data_sources s where s.name = 'Wikipedia'), 'Molybdenum'),
('Vitamin B7',     (select u.id from units u where u.abbr = 'µg'), true, false, (select c.id from nutrient_categories c where c.name = 'Vitamins'), (select s.id from data_sources s where s.name = 'Wikipedia'), 'Biotin');

insert into nutrients (source_id, external_id, name, unit_id, is_essential, is_visible_default, category_id)
select
    (select s.id from data_sources s where s.abbr = 'USDA'),
    nd.nutr_no,
    case
        when nd.nutrdesc = '18:3 n-3 c,c,c (ALA)' then 'Omega-3 (ALA)'
        when nd.nutrdesc = '20:5 n-3 (EPA)' then 'Omega-3 (EPA)'
        when nd.nutrdesc = '22:5 n-3 (DPA)' then 'Omega-3 (DPA)'
        when nd.nutrdesc = '22:6 n-3 (DHA)' then 'Omega-3 (DHA)'
        when nd.nutrdesc = 'Carbohydrate, by difference' then 'Carbohydrates'
        when nd.nutrdesc = 'Folate, total' then 'Vitamin B9'
        when nd.nutrdesc = 'Niacin' then 'Vitamin B3'
        when nd.nutrdesc = 'Pantothenic acid' then 'Vitamin B5'
        when nd.nutrdesc = 'Riboflavin' then 'Vitamin B2'
        when nd.nutrdesc = 'Thiamin' then 'Vitamin B1'
        when nd.nutrdesc = 'Vitamin B-12, added' then 'Vitamin B12, added'
        when nd.nutrdesc = 'Vitamin B-12' then 'Vitamin B12'
        when nd.nutrdesc = 'Vitamin B-6' then 'Vitamin B6'
        when nd.nutrdesc = 'Vitamin C, total ascorbic acid' then 'Vitamin C'
        when nd.nutrdesc = 'Vitamin D2 (ergocalciferol)' then 'Vitamin D2'
        when nd.nutrdesc = 'Vitamin D3 (cholecalciferol)' then 'Vitamin D3'
        when nd.nutrdesc = 'Vitamin E (alpha-tocopherol)' then 'Vitamin E'
        when nd.nutrdesc = 'Vitamin K (phylloquinone)' then 'Vitamin K'
        else nd.nutrdesc
    end,
    (select u.id from units u where u.abbr = nd.units),
    nd.nutrdesc in (
        '18:2 n-6 c,c',
        '18:3 n-3 c,c,c (ALA)',
        'Calcium, Ca',
        'Copper, Cu',
        'Folate, total',
        'Histidine',
        'Iron, Fe',
        'Isoleucine',
        'Leucine',
        'Lysine',
        'Magnesium, Mg',
        'Manganese, Mn',
        'Methionine',
        'Niacin',
        'Pantothenic acid',
        'Phenylalanine',
        'Phosphorus, P',
        'Potassium, K',
        'Riboflavin',
        'Selenium, Se',
        'Sodium, Na',
        'Thiamin',
        'Threonine',
        'Tocopherol, beta',
        'Tocopherol, delta',
        'Tocopherol, gamma',
        'Tocotrienol, alpha',
        'Tocotrienol, beta',
        'Tocotrienol, delta',
        'Tocotrienol, gamma',
        'Tryptophan',
        'Valine',
        'Vitamin A, IU',
        'Vitamin B-12',
        'Vitamin B-6',
        'Vitamin C, total ascorbic acid',
        'Vitamin D',
        'Vitamin D2 (ergocalciferol)',
        'Vitamin D3 (cholecalciferol)',
        'Vitamin E (alpha-tocopherol)',
        'Vitamin K (phylloquinone)',
        'Zinc, Zn'
    ),
    nd.nutrdesc in (
        '18:3 n-3 c,c,c (ALA)',
        '20:5 n-3 (EPA)',
        '22:5 n-3 (DPA)',
        '22:6 n-3 (DHA)',
        'Calcium, Ca',
        'Carbohydrate, by difference',
        'Cholesterol',
        'Copper, Cu',
        'Energy',
        'Fatty acids, total monounsaturated',
        'Fatty acids, total polyunsaturated',
        'Fatty acids, total saturated',
        'Fatty acids, total trans',
        'Fiber, total dietary',
        'Fluoride, F',
        'Folate, total',
        'Iron, Fe',
        'Magnesium, Mg',
        'Manganese, Mn',
        'Niacin',
        'Pantothenic acid',
        'Phosphorus, P',
        'Potassium, K',
        'Protein',
        'Riboflavin',
        'Selenium, Se',
        'Sodium, Na',
        'Sugars, total',
        'Thiamin',
        'Total lipid (fat)',
        'Vitamin A, IU',
        'Vitamin B-12, added',
        'Vitamin B-12',
        'Vitamin B-6',
        'Vitamin C, total ascorbic acid',
        'Vitamin D',
        'Vitamin E (alpha-tocopherol)',
        'Vitamin E, added',
        'Vitamin K (phylloquinone)',
        'Zinc, Zn',
        'Water'
    ),
    (
        select c.id
        from nutrient_categories c
        where c.name = case
            when nd.nutrdesc = '10:0' then 'Fats'
            when nd.nutrdesc = '12:0' then 'Fats'
            when nd.nutrdesc = '13:0' then 'Fats'
            when nd.nutrdesc = '14:0' then 'Fats'
            when nd.nutrdesc = '14:1' then 'Fats'
            when nd.nutrdesc = '15:0' then 'Fats'
            when nd.nutrdesc = '15:1' then 'Fats'
            when nd.nutrdesc = '16:0' then 'Fats'
            when nd.nutrdesc = '16:1 c' then 'Fats'
            when nd.nutrdesc = '16:1 t' then 'Fats'
            when nd.nutrdesc = '16:1 undifferentiated' then 'Fats'
            when nd.nutrdesc = '17:0' then 'Fats'
            when nd.nutrdesc = '17:1' then 'Fats'
            when nd.nutrdesc = '18:0' then 'Fats'
            when nd.nutrdesc = '18:1-11 t (18:1t n-7)' then 'Fats'
            when nd.nutrdesc = '18:1 c' then 'Fats'
            when nd.nutrdesc = '18:1 t' then 'Fats'
            when nd.nutrdesc = '18:1 undifferentiated' then 'Fats'
            when nd.nutrdesc = '18:2 CLAs' then 'Fats'
            when nd.nutrdesc = '18:2 i' then 'Fats'
            when nd.nutrdesc = '18:2 n-6 c,c' then 'Fats'
            when nd.nutrdesc = '18:2 t not further defined' then 'Fats'
            when nd.nutrdesc = '18:2 t,t' then 'Fats'
            when nd.nutrdesc = '18:2 undifferentiated' then 'Fats'
            when nd.nutrdesc = '18:3i' then 'Fats'
            when nd.nutrdesc = '18:3 n-3 c,c,c (ALA)' then 'Fats'
            when nd.nutrdesc = '18:3 n-6 c,c,c' then 'Fats'
            when nd.nutrdesc = '18:3 undifferentiated' then 'Fats'
            when nd.nutrdesc = '18:4' then 'Fats'
            when nd.nutrdesc = '20:0' then 'Fats'
            when nd.nutrdesc = '20:1' then 'Fats'
            when nd.nutrdesc = '20:2 n-6 c,c' then 'Fats'
            when nd.nutrdesc = '20:3 n-3' then 'Fats'
            when nd.nutrdesc = '20:3 n-6' then 'Fats'
            when nd.nutrdesc = '20:3 undifferentiated' then 'Fats'
            when nd.nutrdesc = '20:4 n-6' then 'Fats'
            when nd.nutrdesc = '20:4 undifferentiated' then 'Fats'
            when nd.nutrdesc = '20:5 n-3 (EPA)' then 'Fats'
            when nd.nutrdesc = '21:5' then 'Fats'
            when nd.nutrdesc = '22:0' then 'Fats'
            when nd.nutrdesc = '22:1 c' then 'Fats'
            when nd.nutrdesc = '22:1 t' then 'Fats'
            when nd.nutrdesc = '22:1 undifferentiated' then 'Fats'
            when nd.nutrdesc = '22:4' then 'Fats'
            when nd.nutrdesc = '22:5 n-3 (DPA)' then 'Fats'
            when nd.nutrdesc = '22:6 n-3 (DHA)' then 'Fats'
            when nd.nutrdesc = '24:0' then 'Fats'
            when nd.nutrdesc = '24:1 c' then 'Fats'
            when nd.nutrdesc = '4:0' then 'Fats'
            when nd.nutrdesc = '6:0' then 'Fats'
            when nd.nutrdesc = '8:0' then 'Fats'
            when nd.nutrdesc = 'Alanine' then 'Proteins'
            when nd.nutrdesc = 'Alcohol, ethyl' then 'Other'
            when nd.nutrdesc = 'Arginine' then 'Proteins'
            when nd.nutrdesc = 'Ash' then 'Other'
            when nd.nutrdesc = 'Aspartic acid' then 'Proteins'
            when nd.nutrdesc = 'Betaine' then 'Other'
            when nd.nutrdesc = 'Beta-sitosterol' then 'Other'
            when nd.nutrdesc = 'Caffeine' then 'Other'
            when nd.nutrdesc = 'Calcium, Ca' then 'Minerals'
            when nd.nutrdesc = 'Campesterol' then 'Other'
            when nd.nutrdesc = 'Carbohydrate, by difference' then 'Carbohydrates'
            when nd.nutrdesc = 'Carotene, alpha' then 'Other'
            when nd.nutrdesc = 'Carotene, beta' then 'Other'
            when nd.nutrdesc = 'Cholesterol' then 'Other'
            when nd.nutrdesc = 'Choline, total' then 'Other'
            when nd.nutrdesc = 'Copper, Cu' then 'Minerals'
            when nd.nutrdesc = 'Cryptoxanthin, beta' then 'Other'
            when nd.nutrdesc = 'Cystine' then 'Proteins'
            when nd.nutrdesc = 'Dihydrophylloquinone' then 'Vitamins'
            when nd.nutrdesc = 'Energy' then 'Other'
            when nd.nutrdesc = 'Fatty acids, total monounsaturated' then 'Fats'
            when nd.nutrdesc = 'Fatty acids, total polyunsaturated' then 'Fats'
            when nd.nutrdesc = 'Fatty acids, total saturated' then 'Fats'
            when nd.nutrdesc = 'Fatty acids, total trans' then 'Fats'
            when nd.nutrdesc = 'Fatty acids, total trans-monoenoic' then 'Fats'
            when nd.nutrdesc = 'Fatty acids, total trans-polyenoic' then 'Fats'
            when nd.nutrdesc = 'Fiber, total dietary' then 'Other'
            when nd.nutrdesc = 'Fluoride, F' then 'Minerals'
            when nd.nutrdesc = 'Folate, DFE' then 'Vitamins'
            when nd.nutrdesc = 'Folate, food' then 'Vitamins'
            when nd.nutrdesc = 'Folate, total' then 'Vitamins'
            when nd.nutrdesc = 'Folic acid' then 'Vitamins'
            when nd.nutrdesc = 'Fructose' then 'Carbohydrates'
            when nd.nutrdesc = 'Galactose' then 'Carbohydrates'
            when nd.nutrdesc = 'Glucose (dextrose)' then 'Carbohydrates'
            when nd.nutrdesc = 'Glutamic acid' then 'Proteins'
            when nd.nutrdesc = 'Glycine' then 'Proteins'
            when nd.nutrdesc = 'Histidine' then 'Proteins'
            when nd.nutrdesc = 'Hydroxyproline' then 'Proteins'
            when nd.nutrdesc = 'Iron, Fe' then 'Minerals'
            when nd.nutrdesc = 'Isoleucine' then 'Proteins'
            when nd.nutrdesc = 'Lactose' then 'Carbohydrates'
            when nd.nutrdesc = 'Leucine' then 'Proteins'
            when nd.nutrdesc = 'Lutein + zeaxanthin' then 'Other'
            when nd.nutrdesc = 'Lycopene' then 'Other'
            when nd.nutrdesc = 'Lysine' then 'Proteins'
            when nd.nutrdesc = 'Magnesium, Mg' then 'Minerals'
            when nd.nutrdesc = 'Maltose' then 'Carbohydrates'
            when nd.nutrdesc = 'Manganese, Mn' then 'Minerals'
            when nd.nutrdesc = 'Menaquinone-4' then 'Vitamins'
            when nd.nutrdesc = 'Methionine' then 'Proteins'
            when nd.nutrdesc = 'Niacin' then 'Vitamins'
            when nd.nutrdesc = 'Pantothenic acid' then 'Vitamins'
            when nd.nutrdesc = 'Phenylalanine' then 'Proteins'
            when nd.nutrdesc = 'Phosphorus, P' then 'Minerals'
            when nd.nutrdesc = 'Phytosterols' then 'Other'
            when nd.nutrdesc = 'Potassium, K' then 'Minerals'
            when nd.nutrdesc = 'Proline' then 'Proteins'
            when nd.nutrdesc = 'Protein' then 'Proteins'
            when nd.nutrdesc = 'Retinol' then 'Vitamins'
            when nd.nutrdesc = 'Riboflavin' then 'Vitamins'
            when nd.nutrdesc = 'Selenium, Se' then 'Minerals'
            when nd.nutrdesc = 'Serine' then 'Proteins'
            when nd.nutrdesc = 'Sodium, Na' then 'Minerals'
            when nd.nutrdesc = 'Starch' then 'Carbohydrates'
            when nd.nutrdesc = 'Stigmasterol' then 'Other'
            when nd.nutrdesc = 'Sucrose' then 'Carbohydrates'
            when nd.nutrdesc = 'Sugars, total' then 'Carbohydrates'
            when nd.nutrdesc = 'Theobromine' then 'Other'
            when nd.nutrdesc = 'Thiamin' then 'Vitamins'
            when nd.nutrdesc = 'Threonine' then 'Proteins'
            when nd.nutrdesc = 'Tocopherol, beta' then 'Vitamins'
            when nd.nutrdesc = 'Tocopherol, delta' then 'Vitamins'
            when nd.nutrdesc = 'Tocopherol, gamma' then 'Vitamins'
            when nd.nutrdesc = 'Tocotrienol, alpha' then 'Vitamins'
            when nd.nutrdesc = 'Tocotrienol, beta' then 'Vitamins'
            when nd.nutrdesc = 'Tocotrienol, delta' then 'Vitamins'
            when nd.nutrdesc = 'Tocotrienol, gamma' then 'Vitamins'
            when nd.nutrdesc = 'Total lipid (fat)' then 'Fats'
            when nd.nutrdesc = 'Tryptophan' then 'Proteins'
            when nd.nutrdesc = 'Tyrosine' then 'Proteins'
            when nd.nutrdesc = 'Valine' then 'Proteins'
            when nd.nutrdesc = 'Vitamin A, IU' then 'Vitamins'
            when nd.nutrdesc = 'Vitamin A, RAE' then 'Vitamins'
            when nd.nutrdesc = 'Vitamin B-12' then 'Vitamins'
            when nd.nutrdesc = 'Vitamin B-12, added' then 'Vitamins'
            when nd.nutrdesc = 'Vitamin B-6' then 'Vitamins'
            when nd.nutrdesc = 'Vitamin C, total ascorbic acid' then 'Vitamins'
            when nd.nutrdesc = 'Vitamin D' then 'Vitamins'
            when nd.nutrdesc = 'Vitamin D2 (ergocalciferol)' then 'Vitamins'
            when nd.nutrdesc = 'Vitamin D3 (cholecalciferol)' then 'Vitamins'
            when nd.nutrdesc = 'Vitamin D (D2 + D3)' then 'Vitamins'
            when nd.nutrdesc = 'Vitamin E, added' then 'Vitamins'
            when nd.nutrdesc = 'Vitamin E (alpha-tocopherol)' then 'Vitamins'
            when nd.nutrdesc = 'Vitamin K (phylloquinone)' then 'Vitamins'
            when nd.nutrdesc = 'Water' then 'Other'
            when nd.nutrdesc = 'Zinc, Zn' then 'Minerals'
        end
    )
from usda.nutr_def nd
where nd.tagname is null
or nd.tagname != 'ENERC_KJ';

insert into foods (source_id, external_id, name, usda_category_id)
select
    (select s.id from data_sources s where s.abbr = 'USDA'),
    fd.ndb_no,
    fd.long_desc,
    (select c.id from usda_categories c where c.usda_id = fd.fdgrp_cd)
from usda.food_des fd;

insert into food_nutrients (food_id, nutrient_id, amount)
select
    (
        select f.id
        from foods f
        where f.source_id = (select s.id from data_sources s where s.abbr = 'USDA')
        and f.external_id = nd.ndb_no
    ),
    (
        select n.id
        from nutrients n
        where n.source_id = (select s.id from data_sources s where s.abbr = 'USDA')
        and n.external_id = nd.nutr_no
    ),
    nd.nutr_val
from usda.nut_data nd
where nd.nutr_no != (
    select nutr_no
    from usda.nutr_def
    where tagname = 'ENERC_KJ'
);

insert into food_unit_ratios (food_id, unit, grams)
select distinct
    (
        select f.id
        from foods f
        where f.source_id = (select s.id from data_sources s where s.abbr = 'USDA')
        and f.external_id = w.ndb_no
    ),
    replace(replace(replace(
        rtrim(w.msre_desc, ','),
        '  ', ' '),
        '( ', '('),
        ' )', ')'),
    w.gm_wgt / w.amount
from usda.weight w
where w.amount != 0
on conflict do nothing;
