alter table fd_group
add column interest int not null default 0,
add constraint chk_fg_interest check (interest >= 0);

update fd_group set interest = 10 where FdGrp_Desc in (
    'Spices and Herbs',
    'Cereal Grains and Pasta',
    'Fruits and Fruit Juices',
    'Legumes and Legume Products',
    'Nut and Seed Products',
    'Vegetables and Vegetable Products'
);

alter table nutr_def
add column interest int not null default 0,
add constraint chk_ndf_interest check (interest >= 0);

update nutr_def set interest = 10 where NutrDesc in (
    '18:3 n-3 c,c,c (ALA)',
    '20:5 n-3 (EPA)',
    '22:6 n-3 (DHA)',
    'Calcium, Ca',
    'Carbohydrate, by difference',
    'Copper, Cu',
    'Energy',
    'Fatty acids, total monounsaturated',
    'Fatty acids, total polyunsaturated',
    'Fatty acids, total saturated',
    'Fatty acids, total trans',
    'Fiber, total dietary',
    'Fluoride, F',
    'Folate, total', -- B9
    'Iron, Fe',
    'Magnesium, Mg',
    'Manganese, Mn',
    'Niacin', -- B3
    'Pantothenic acid', -- B5
    'Phosphorus, P',
    'Potassium, K',
    'Protein',
    'Riboflavin', -- B2
    'Selenium, Se',
    'Sodium, Na',
    'Thiamin', -- B1
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
    'Zinc, Zn'
)
and Tagname != 'ENERC_KJ';

update nutr_def set interest = 5 where NutrDesc in (
    '18:2 CLAs',
    '22:5 n-3 (DPA)',
    'Alcohol, ethyl',
    'Caffeine',
    'Carotene, alpha',
    'Carotene, beta',
    'Cholesterol',
    'Choline, total',
    'Fructose',
    'Glucose (dextrose)',
    'Lactose',
    'Maltose',
    'Starch',
    'Sucrose',
    'Sugars, total',
    'Vitamin D (D2 + D3)',
    'Vitamin D2 (ergocalciferol)',
    'Vitamin D3 (cholecalciferol)',
    'Water'
);

commit;
