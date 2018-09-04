-- Healthy food groups.
select fg.FdGrp_Cd
from fd_group fg
where fg.interest >= 10;

-- Foods in a given group.
select fd.NDB_No, fd.Long_Desc
from food_des fd
where fd.FdGrp_Cd = (
    select fg.FdGrp_Cd
    from fd_group fg
    where fg.FdGrp_Desc = 'Spices and Herbs'
)
order by fd.Long_Desc;

-- Healthy foods.
select fg.FdGrp_Cd, fg.FdGrp_Desc, fd.NDB_No, fd.Long_Desc
from food_des fd
join fd_group fg on (fg.FdGrp_Cd = fd.FdGrp_Cd)
where fg.interest >= 10
order by fg.FdGrp_Desc, fd.Long_Desc;

-- Information sources of a given food.
select distinct ds.Journal, ds.Title, ds.Authors, ds.Year
from food_des fd
join datsrcln dsl on (dsl.NDB_No = fd.NDB_No)
join data_src ds on (ds.DataSrc_ID = dsl.DataSrc_ID)
where fd.Long_Desc = 'Water, bottled, generic'
order by ds.Year desc;

-- Find foods by (partial) name.
select fd.NDB_No, fd.Long_Desc, fg.FdGrp_Desc
from food_des fd
join fd_group fg on (fg.FdGrp_Cd = fd.FdGrp_Cd)
where fg.interest >= 10
and lower(fd.Long_Desc) like lower('%water%')
limit 100;

-- Interesting nutrients.
select ndf.Nutr_No, ndf.NutrDesc, ndf.Units
from nutr_def ndf
where ndf.interest >= 10
order by ndf.NutrDesc;

-- Foods highest in a given nutrient.
select fd.NDB_No, fd.Long_Desc, nd.Nutr_Val, ndf.Units, fg.FdGrp_Cd, fg.FdGrp_Desc
from food_des fd
join nut_data nd on (nd.NDB_No = fd.NDB_No)
join fd_group fg on (fg.FdGrp_Cd = fd.FdGrp_Cd)
join nutr_def ndf on (nd.Nutr_No = ndf.Nutr_No)
where ndf.NutrDesc = 'Calcium, Ca'
and fg.interest >= 10
and (nd.Add_Nutr_Mark is null or nd.Add_Nutr_Mark != 'Y')
order by nd.Nutr_Val desc
limit 100;

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
