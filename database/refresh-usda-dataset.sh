#!/bin/bash

echo -e "\n> Installing dependencies"

sudo apt install wget unzip dos2unix


echo -e "\n> Downloading raw data from https://ndb.nal.usda.gov/ndb/"

rm -rf data/usda
mkdir data/usda
cd data/usda

wget https://www.ars.usda.gov/ARSUserFiles/80400525/Data/SR-Legacy/SR-Leg_ASC.zip
unzip SR-Leg_ASC.zip
rm *.zip *.pdf
dos2unix *.txt


echo -e "\n> Loading data"

for TABLE in src_cd deriv_cd data_src footnote langdesc nutr_def fd_group food_des nut_data weight langual datsrcln
do
  FILE=${TABLE^^}.txt
  echo -e "> Processing file $FILE"
  mv $FILE $FILE.old
  iconv -f LATIN1 -t UTF-8 $FILE.old -o $FILE
  rm $FILE.old
done
