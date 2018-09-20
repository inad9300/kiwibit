use usda28;

alter table fd_group
add column color char(7) not null default '#000000',
add constraint chk_fd_group_color check (fd_group regexp '#[0-9a-f]{6}' = 1);

update fd_group set color = '#f4f4f4' where FdGrp_Desc = 'Dairy and Egg Products';
update fd_group set color = '#5fb356' where FdGrp_Desc = 'Spices and Herbs';
update fd_group set color = '#feadfa' where FdGrp_Desc = 'Baby Foods';
update fd_group set color = '#cec409' where FdGrp_Desc = 'Fats and Oils';
update fd_group set color = '#d59c5c' where FdGrp_Desc = 'Poultry Products';
update fd_group set color = '#ffc640' where FdGrp_Desc = 'Soups, Sauces, and Gravies';
update fd_group set color = '#e76b1d' where FdGrp_Desc = 'Sausages and Luncheon Meats';
update fd_group set color = '#85403b' where FdGrp_Desc = 'Breakfast Cereals';
update fd_group set color = '#f79f09' where FdGrp_Desc = 'Fruits and Fruit Juices';
update fd_group set color = '#b62847' where FdGrp_Desc = 'Pork Products';
update fd_group set color = '#4b7007' where FdGrp_Desc = 'Vegetables and Vegetable Products';
update fd_group set color = '#c37d41' where FdGrp_Desc = 'Nut and Seed Products';
update fd_group set color = '#e33b17' where FdGrp_Desc = 'Beef Products';
update fd_group set color = '#52ace3' where FdGrp_Desc = 'Beverages';
update fd_group set color = '#5e88a2' where FdGrp_Desc = 'Finfish and Shellfish Products';
update fd_group set color = '#752242' where FdGrp_Desc = 'Legumes and Legume Products';
update fd_group set color = '#d55e60' where FdGrp_Desc = 'Lamb, Veal, and Game Products';
update fd_group set color = '#dc9c5e' where FdGrp_Desc = 'Baked Products';
update fd_group set color = '#ffade3' where FdGrp_Desc = 'Sweets';
update fd_group set color = '#f1b54d' where FdGrp_Desc = 'Cereal Grains and Pasta';
update fd_group set color = '#eb0001' where FdGrp_Desc = 'Fast Foods';
update fd_group set color = '#f7eba1' where FdGrp_Desc = 'Meals, Entrees, and Side Dishes';
update fd_group set color = '#b99460' where FdGrp_Desc = 'Snacks';
update fd_group set color = '#ffa210' where FdGrp_Desc = 'American Indian/Alaska Native Foods';
update fd_group set color = '#273875' where FdGrp_Desc = 'Restaurant Foods';
commit;
