drop database if exists usdanlsr28;
create database if not exists usdanlsr28 charset = utf8;

use usdanlsr28;

/*
* Source Code.
*
* This table contains codes indicating the type of data (analytical, calculated,
* assumed zero, and so on) in the Nutrient Data file. To improve the usability
* of the database and to provide values for the FNDDS, NDL staff imputed nutrient
* values for a number of proximate components, total dietary fiber, total sugar,
* and vitamin and mineral values.
*/
create table src_cd (
	Src_Cd		char(2)		not null,	-- a 2-digit code indicating type of data.
	SrcCd_Desc	char(60)	not null,	-- description of source code that identifies the type of nutrient data.
	constraint src_cd_pk primary key (Src_Cd)
);

/*
* Data Derivation Code Description.
*
* This table provides information on how the nutrient values were determined.
* The file contains the derivation codes and their descriptions.
*/
create table deriv_cd (
	Deriv_Cd	char(4)		not null,	-- derivation code
	Deriv_Desc	char(120)	not null,	-- description of derivation code giving specific information on how the value was determined.
	constraint deriv_cd_pk primary key (Deriv_Cd)
);

/*
* Sources of Data.
*
* This table provides a citation to the DataSrc_ID in the Sources of Data Link file.
*/
create table data_src (
	DataSrc_ID 	char(6)		not null, 	-- unique ID identifying the reference/source.
	Authors 	char(255),				-- list of authors for a journal article or name of sponsoring organization for other documents.
	Title 		char(255)	not null,	-- title of article or name of document, such as a report from a company or trade association.
	Year 		char(4),				-- year article or document was published.
	Journal 	char(135),				-- name of the journal in which the article was published.
	Vol_City 	char(16), 				-- volume number for journal articles, books, or reports; city where sponsoring organization is located.
	Issue_State char(5),				-- issue number for journal article; State where the sponsoring organization is located.
	Start_Page 	char(5),				-- starting page number of article/document.
	End_Page 	char(5),				-- ending page number of article/document.
	constraint data_src_pk primary key (DataSrc_ID)
);

/*
* Footnote.
*
* This table contains additional information about the food item, household weight,
* and nutrient value.
*/
create table footnote (
	NDB_No		char(5)		not null,	-- 5-digit Nutrient Databank number that uniquely identifies a food item
	FootNt_No	char(4)		not null,	-- sequence number. If a given footnote applies to more than one nutrient number, the same footnote number is used.
	Footnt_Typ	char(1)		not null,	-- type of footnote (D = footnote adding information to the food description; M = footnote adding information to measure description; N = footnote providing additional information on a nutrient value. If the Footnt_Typ = N, the Nutr_No will also be filled in.
	Nutr_No		char(3),				-- unique 3-digit identifier code for a nutrient to which footnote applies.
	Footnt_Txt	char(200)	not null	-- footnote text.
);

/*
* LanguaL Factors Description.
*
* This table is a support file to the LanguaL Factor file and contains
* the descriptions for only those factors used in coding the selected
* food items codes in this release of SR.
*/
create table langdesc (
	Factor_Code	char(5)		not null,	-- the LanguaL factor from the Thesaurus.
	Description	char(140)	not null,	-- the description of the LanguaL Factor Code from the thesaurus.
	constraint langdesc_pk primary key (Factor_Code)
);

/*
* Nutrient Definition.
*
* This table is a support file to the Nutrient Data file.
* It provides the 3-digit nutrient code, unit of measure, INFOODS
* tagname, and description.
*/
create table nutr_def (
	Nutr_No		char(3)			not null,	-- unique 3-digit identifier code for a nutrient.
	Units		char(7)			not null,	-- units of measure (mg, g, µg, and so on).
	Tagname		char(20),					-- International Network of Food Data Systems (INFOODS) tagnames.
	NutrDesc	char(60)		not null,	-- name of nutrient/food component.
	Num_Dec		decimal(6,0)	not null,	-- number of decimal places to which a nutrient value is rounded
	SR_Order	decimal(6,0)	not null,
	constraint nutr_def_pk primary key (Nutr_No)
);

/*
* Food Group Description.
*
* This table is a support file to the Food Description file and contains
* a list of food groups and their descriptions.
*/
create table fd_group (
	FdGrp_Cd	char(4)		not null,	-- 4-digit code identifying a food group.
	FdGrp_Desc	char(60)	not null,	-- name of food group
	constraint fd_group_pk primary key (FdGrp_Cd)
);

/*
* Food Description.
*
* This table contains long and short descriptions and food group
* designators for all food items, along with common names, manufacturer
* name, scientific name, percentage and description of refuse, and
* factors used for calculating protein and kilocalories, if applicable.
* Items used in the FNDDS are also identified by value of “Y” in the
* Survey field.
*/
create table food_des (
	NDB_No 		char(5) 	not null, 	-- 5-digit Nutrient Databank number that uniquely identifies a food item.
	FdGrp_Cd	char(4) 	not null, 	-- 4-digit code indicating food group to which a food item belongs.
	Long_Desc	char(200)	not null, 	-- 200-character description of food item.
	Shrt_Desc	char(60)	not null, 	-- 60-character abbreviated description of food item.
	ComName		char(100),				-- other names commonly used to describe a food, including local or regional names.
	ManufacName	char(65),				-- indicates the company that manufactured the product, when appropriate.
	Survey		char(1),				-- indicates if the food has a complete nutrient profile including all 65 FNDDS nutrients.
	Ref_desc	char(135),				-- description of inedible parts of a food item (refuse), such as seeds or bone.
	Refuse		decimal(2),				-- percentage of refuse
	SciName		char(65),				-- scientific name of the food item.
	N_Factor	decimal(4,2),			-- factor for converting nitrogen to protein.
	Pro_Factor	decimal(4,2),			-- factor for calculating calories from protein.
	Fat_Factor	decimal(4,2),			-- factor for calculating calories from fat.
	CHO_Factor	decimal(4,2),			-- factor for calculating calories from carbohydrate.
	constraint food_des_pk primary key (NDB_No),
	constraint food_des_uk UNIQUE (NDB_No,FdGrp_Cd),
	constraint food_des_fk foreign key (FdGrp_Cd) references fd_group(FdGrp_Cd)
);

/*
* Nutrient Data.
*
* This table contains the nutrient values and information about the values,
* including expanded statistical information.
*/
create table nut_data (
	NDB_No 			char(5) 		not null, 	-- 5-digit Nutrient Databank number that uniquely identifies a food item.
	Nutr_No			char(3)			not null,	-- unique 3-digit identifier code for a nutrient.
	Nutr_Val		decimal(10,3)	not null,	-- amount in 100 grams, edible portion.
	Num_Data_Pts	decimal(5,0)	not null,	-- number of data points/analyses used to calculate the nutrient value.
	Std_Error		decimal(8,3),				-- standard error of the mean. null, if cannot be calculated. The standard error is also not given, if the number of data points is less than three.
	Src_Cd			char(2)			not null,	-- code indicating type of data.
	Deriv_Cd		char(4),					-- data derivation code giving specific information on how value is determined.
	Ref_NDB_No		char(5),					-- NDB number of the item used to calculate a missing value.
	Add_Nutr_Mark	char(1),					-- indicates a vitamin or mineral added for fortification or enrichment.
	Num_Studies		decimal(2,0),				-- number of studies.
	Min				decimal(10,3),				-- minimum value.
	Max				decimal(10,3),				-- maximum value.
	DF				decimal(4,0),				-- degrees of freedom.
    Low_EB			decimal(10,3),				-- Lower 95% error bound.
	Up_EB			decimal(10,3),				-- Upper 95% error bound.
	Stat_cmt		char(10),					-- Statistical comments (see documentation for definitions)
	AddMod_Date		char(10),					-- indicates when a value was either added to the database or last modified
	CC				char(1),					-- confidence code indicating data quality, based on evaluation (NYI)
	constraint nut_data_pk primary key (NDB_No, Nutr_No),
	constraint nut_data_ndbno_fk foreign key (NDB_No) references food_des(NDB_No),
	constraint nut_data_nutdef_fk foreign key (Nutr_No) references nutr_def(Nutr_No)
);

/*
* Weight.
*
* This table contains the weight in grams of a number of common measures
* for each food item.
*/
create table weight (
	NDB_No			char(5)			not null,	-- 5-digit Nutrient Databank number that uniquely identifies a food item
	Seq				char(2)			not null,	-- sequence number
	Amount			decimal(5,3)	not null,	-- unit modifier (e.g. 1 in "1 cup")
	Msre_Desc		char(84)		not null,	-- description (e.g. cup, diced, 1" pieces)
	Gm_Wgt			decimal(7,1)	not null,	-- gram weight
	Num_Data_Pts	decimal(3,0),				-- number of data points
	Std_Dev			decimal(7,3),				-- standard deviation
	constraint weight_pk primary key (NDB_No,Seq),
	constraint weight_ndbno_fk foreign key (NDB_No) references food_des(NDB_No)
);

/*
* LanguaL Factor.
*
* This table is a support file to the Food Description file and contains
* the factors from the LanguaL Thesaurus used to code a particular food.
*/
create table langual (
	NDB_No		char(5)		not null,	-- 5-digit Nutrient Databank number that uniquely identifies a food item.
	Factor_Code	char(5)		not null,	-- the LanguaL factor from the Thesaurus.
	constraint langual_pk primary key (NDB_No, Factor_Code),
	constraint langual_food_des_fk foreign key (NDB_No) references food_des(NDB_No),
	constraint langual_langdesc_fk foreign key (Factor_Code) references langdesc(Factor_Code)
);

/*
* Sources of Data Link.
*
* This table is used to link the Nutrient Data file with the Sources of Data table.
* It is needed to resolve the many-to-many relationship between the two tables.
*/
create table datsrcln (
	NDB_No 		char(5) 	not null, 	-- 5-digit Nutrient Databank number that uniquely identifies a food item.
	Nutr_No		char(3)		not null,	-- unique 3-digit identifier code for a nutrient.
	DataSrc_ID	char(6)		not null,	-- unique ID identifying the reference/source.
	constraint datsrcln_pk primary key (NDB_No,Nutr_No,DataSrc_ID),
	constraint datsrcln_ndb_fk foreign key (NDB_No) references food_des(NDB_No),
	constraint datsrcln_nut_fk foreign key (Nutr_No) references nutr_def(Nutr_No),
	constraint datsrcln_src_fk foreign key (DataSrc_ID) references data_src(DataSrc_ID)
);
