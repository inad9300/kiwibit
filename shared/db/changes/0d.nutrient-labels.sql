use usdanlsr28;

alter table nutr_def add column display_name char(30);

update nutr_def set display_name = 'Vitamin B1' where NutrDesc = 'Thiamin';
update nutr_def set display_name = 'Vitamin B2' where NutrDesc = 'Riboflavin';
update nutr_def set display_name = 'Vitamin B3' where NutrDesc = 'Niacin';
update nutr_def set display_name = 'Vitamin B5' where NutrDesc = 'Pantothenic acid';
update nutr_def set display_name = 'Vitamin B6' where NutrDesc = 'Vitamin B-6';
update nutr_def set display_name = 'Vitamin B9' where NutrDesc = 'Folate, total';
update nutr_def set display_name = 'Vitamin B12' where NutrDesc = 'Vitamin B-12';
update nutr_def set display_name = 'Vitamin B12, added' where NutrDesc = 'Vitamin B-12, added';
update nutr_def set display_name = 'Omega-3 (ALA)' where NutrDesc = '18:3 n-3 c,c,c (ALA)';
update nutr_def set display_name = 'Omega-3 (EPA)' where NutrDesc = '20:5 n-3 (EPA)';
update nutr_def set display_name = 'Omega-3 (DHA)' where NutrDesc = '22:6 n-3 (DHA)';
update nutr_def set display_name = 'Omega-3 (DPA)' where NutrDesc = '22:5 n-3 (DPA)';
update nutr_def set display_name = 'Vitamin D2' where NutrDesc = 'Vitamin D2 (ergocalciferol)';
update nutr_def set display_name = 'Vitamin D3' where NutrDesc = 'Vitamin D3 (cholecalciferol)';
update nutr_def set display_name = 'Vitamin K' where NutrDesc = 'Vitamin K (phylloquinone)';
update nutr_def set display_name = 'Vitamin E' where NutrDesc = 'Vitamin E (alpha-tocopherol)';
update nutr_def set display_name = 'Vitamin C' where NutrDesc = 'Vitamin C, total ascorbic acid';
update nutr_def set display_name = 'Carbohydrate' where NutrDesc = 'Carbohydrate, by difference';
commit;
