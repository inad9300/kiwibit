alter table fd_group
add column color char(7) not null default '#000000',
add constraint chk_fd_group_color check (color ~ '#[0-9a-f]{6}');

update fd_group set color = '#f4f4f4' where fdgrp_desc = 'Dairy and Egg Products';
update fd_group set color = '#5fb356' where fdgrp_desc = 'Spices and Herbs';
update fd_group set color = '#feadfa' where fdgrp_desc = 'Baby Foods';
update fd_group set color = '#cec409' where fdgrp_desc = 'Fats and Oils';
update fd_group set color = '#d59c5c' where fdgrp_desc = 'Poultry Products';
update fd_group set color = '#ffc640' where fdgrp_desc = 'Soups, Sauces, and Gravies';
update fd_group set color = '#e76b1d' where fdgrp_desc = 'Sausages and Luncheon Meats';
update fd_group set color = '#85403b' where fdgrp_desc = 'Breakfast Cereals';
update fd_group set color = '#f79f09' where fdgrp_desc = 'Fruits and Fruit Juices';
update fd_group set color = '#b62847' where fdgrp_desc = 'Pork Products';
update fd_group set color = '#4b7007' where fdgrp_desc = 'Vegetables and Vegetable Products';
update fd_group set color = '#c37d41' where fdgrp_desc = 'Nut and Seed Products';
update fd_group set color = '#e33b17' where fdgrp_desc = 'Beef Products';
update fd_group set color = '#52ace3' where fdgrp_desc = 'Beverages';
update fd_group set color = '#5e88a2' where fdgrp_desc = 'Finfish and Shellfish Products';
update fd_group set color = '#752242' where fdgrp_desc = 'Legumes and Legume Products';
update fd_group set color = '#d55e60' where fdgrp_desc = 'Lamb, Veal, and Game Products';
update fd_group set color = '#dc9c5e' where fdgrp_desc = 'Baked Products';
update fd_group set color = '#ffade3' where fdgrp_desc = 'Sweets';
update fd_group set color = '#f1b54d' where fdgrp_desc = 'Cereal Grains and Pasta';
update fd_group set color = '#eb0001' where fdgrp_desc = 'Fast Foods';
update fd_group set color = '#f7eba1' where fdgrp_desc = 'Meals, Entrees, and Side Dishes';
update fd_group set color = '#b99460' where fdgrp_desc = 'Snacks';
update fd_group set color = '#ffa210' where fdgrp_desc = 'American Indian/Alaska Native Foods';
update fd_group set color = '#273875' where fdgrp_desc = 'Restaurant Foods';
commit;
