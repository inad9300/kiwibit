#!/bin/bash

echo -e "\n> Creating USDA schema"

USDA_SCHEMA=usda
DIR=/docker-entrypoint-initdb.d

psql -c "create schema $USDA_SCHEMA authorization $POSTGRES_USER"
psql -f $DIR/schemas/usda.sql

for TABLE in src_cd deriv_cd data_src footnote langdesc nutr_def fd_group food_des nut_data weight langual datsrcln
do
    echo -e "\n> Processing table $TABLE"
    psql -c "copy $USDA_SCHEMA.$TABLE from '$DIR/data/usda/${TABLE^^}.txt' csv delimiter '^' null '' quote '~' encoding 'UTF8'"
done


echo -e "\n> Creating main schema"

psql -f $DIR/schemas/public.sql


echo -e "\n> Loading data"

for DATA_TYPE in static usda ul rdi
do
    DATA_FILE="$DIR/data/$DATA_TYPE.sql"
    echo -e "\n> Processing file $DATA_FILE"
    psql -f $DATA_FILE
done


echo -e "\n> Applying schema changes"

for UPGRADE_FILE in $DIR/upgrades/*.sql
do
    echo -e "\n> Processing file $UPGRADE_FILE"
    psql -f $UPGRADE_FILE
done
