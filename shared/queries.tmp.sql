-- Information sources of a given food.
select distinct ds.Journal, ds.Title, ds.Authors, ds.Year
from food_des fd
join datsrcln dsl on (dsl.NDB_No = fd.NDB_No)
join data_src ds on (ds.DataSrc_ID = dsl.DataSrc_ID)
where fd.Long_Desc = 'Water, bottled, generic'
order by ds.Year desc;

-- Highest foods for every nutrient.
select ndf.NutrDesc, t1.Nutr_Val, ndf.Units, t1.Long_Desc, t1.FdGrp_Cd, t1.FdGrp_Desc
from (
	select t0.Nutr_No, t0.Nutr_Val, t0.Long_Desc, t0.FdGrp_Cd, t0.FdGrp_Desc,
		@rank := if(@current_nutr = t0.Nutr_No, @rank + 1, 1) as rank,
		@current_nutr := t0.Nutr_No
	from (
		select nd.Nutr_No, nd.Nutr_Val, fd.Long_Desc, fg.FdGrp_Cd, fg.FdGrp_Desc
		from food_des fd
		join nut_data nd on (nd.NDB_No = fd.NDB_No)
		join fd_group fg on (fg.FdGrp_Cd = fd.FdGrp_Cd)
		where fg.interest >= 10
		order by nd.Nutr_No asc, nd.Nutr_Val desc
	) t0
) t1
join nutr_def ndf on (ndf.Nutr_No = t1.Nutr_No)
where ndf.interest >= 10
and t1.rank <= 100;
