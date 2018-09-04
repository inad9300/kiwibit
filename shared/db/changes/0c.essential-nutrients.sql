use usdanlsr28;

alter table nutr_def
add column is_essential char(1) not null default 'N',
add constraint chk_nutr_is_essential check (is_essential in ('Y', 'N'));

-- Source: https://en.wikipedia.org/wiki/Nutrient#Essential_nutrients.

update nutr_def set is_essential = 'Y' where NutrDesc in (
    -- Amino acids.
    'Histidine',
    'Isoleucine',
    'Leucine',
    'Lysine',
    'Methionine',
    'Phenylalanine',
    'Threonine',
    'Tryptophan',
    'Valine',
    -- Fatty acids.
    '18:2 n-6 c,c',
    '18:3 n-3 c,c,c (ALA)',
    -- Vitamins. // Missing: biotin (B7).
    'Folate, total', -- B9
    'Niacin', -- B3
    'Pantothenic acid', -- B5
    'Riboflavin', -- B2
    'Thiamin', -- B1
    'Tocopherol, beta',
    'Tocopherol, delta',
    'Tocopherol, gamma',
    'Tocotrienol, alpha',
    'Tocotrienol, beta',
    'Tocotrienol, delta',
    'Tocotrienol, gamma',
    'Vitamin A, IU',
    'Vitamin B-12',
    'Vitamin B-6',
    'Vitamin C, total ascorbic acid',
    'Vitamin D', -- D2? D3?
    'Vitamin E (alpha-tocopherol)',
    'Vitamin K (phylloquinone)',
    -- Minerals. // Missing: chlorine, iodine, chromium, molybdenum, selenium, cobalt.
    'Calcium, Ca',
    'Copper, Cu',
    'Iron, Fe',
    'Magnesium, Mg',
    'Manganese, Mn',
    'Phosphorus, P',
    'Potassium, K',
    'Selenium, Se',
    'Sodium, Na',
    'Zinc, Zn'
);

commit;
