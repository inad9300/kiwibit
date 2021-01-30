#!/bin/bash

DIR=/docker-entrypoint-initdb.d

echo -e "\n> Creating USDA schema"

psql -c "create schema usda authorization $POSTGRES_USER"
psql -f $DIR/schemas/usda.sql

for TABLE in src_cd deriv_cd data_src footnote langdesc nutr_def fd_group food_des nut_data weight langual datsrcln
do
  echo -e "\n> Processing table $TABLE"
  psql -c "copy usda.$TABLE from '$DIR/datasets/usda/${TABLE^^}.txt' csv delimiter '^' null '' quote '~' encoding 'UTF8'"
done


echo -e "\n> Creating main schema"

psql -f $DIR/schemas/public.sql


echo -e "\n> Applying upgrades"

for UPGRADE_FILE in $DIR/upgrades/*.sql
do
  echo -e "\n> Processing file $UPGRADE_FILE"
  psql -f $UPGRADE_FILE
done
