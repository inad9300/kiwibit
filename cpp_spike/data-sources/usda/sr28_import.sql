#!/bin/bash

# - Download and unzip USDA National Nutrient Database (Release SR-28) ASCII version into ${BASE_PATH}
# - Transform all data files from DOS to UNIX file format
# dos2unix *.txt

# set MySQL variables used for later database management operations

# Create database with predefined schema
mysql -u root -p < ./sr28_schema.sql

# the following data imports only work, if mysql permits to import 
# these files. To prepare for the correct permission, path to CSV 
# files must be added to apparmor config, and apparmor config must 
# be reloaded.
#
#   1) sudo vim /etc/apparmor.d/usr.sbin.mysqld 
#   2) add line "/path/to/csv/ rw" to file within curly brackets
#   3) sudo /etc/init.d/apparmor reload

# Import USDA SR-28 data files into predefined table schema
# load data local infile 'FD_GROUP.txt' into table FD_GROUP fields terminated by '^' enclosed by '\~';
# load data local infile 'FOOD_DES.txt' into table FOOD_DES fields terminated by '^' enclosed by '\~'; -- � -> '
# load data local infile 'DATA_SRC.txt' into table DATA_SRC fields terminated by '^' enclosed by '\~';
# load data local infile 'DERIV_CD.txt' into table DERIV_CD fields terminated by '^' enclosed by '\~';
# load data local infile 'FOOTNOTE.txt' into table FOOTNOTE fields terminated by '^' enclosed by '\~'; -- � -> ”
# load data local infile 'LANGDESC.txt' into table LANGDESC fields terminated by '^' enclosed by '\~';
# load data local infile 'WEIGHT.txt' into table WEIGHT fields terminated by '^' enclosed by '\~';
# load data local infile 'NUTR_DEF.txt' into table NUTR_DEF fields terminated by '^' enclosed by '\~'; -- � -> µ
# load data local infile 'LANGUAL.txt' into table LANGUAL fields terminated by '^' enclosed by '\~';
# load data local infile 'SRC_CD.txt' into table SRC_CD fields terminated by '^' enclosed by '\~';
# load data local infile 'DATSRCLN.txt' into table DATSRCLN fields terminated by '^' enclosed by '\~';
# load data local infile 'NUT_DATA.txt' into table NUT_DATA fields terminated by '^' enclosed by '\~';

# run test query
# mysql -u root -p ${MYSQL_PWD} -e "use usdanlsr28; select * from NUT_DATA;"
