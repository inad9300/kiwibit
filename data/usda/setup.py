#!/usr/bin/env python3

import getpass
import os

pwd = getpass.getpass('Database password: ')

print('Creating schema...')
os.system('mysql -u root -p"' + pwd + '" < ./schema.sql')

tables = [
    'fd_group',
    'food_des',
    'data_src',
    'deriv_cd',
    'footnote',
    'langdesc',
    'weight',
    'nutr_def',
    'langual',
    'src_cd',
    'datsrcln',
    'nut_data'
]

print('Loading data...')
for t in tables:
    script = (
        "use usdanlsr28;"
        " load data local infile './data/{}.txt'"
        " into table {}"
        " fields terminated by '^'"
        " enclosed by '\\~';"
    ).format(t.upper(), t.lower())
    os.system('mysql -u root -p"' + pwd + '" -e "' + script + '"')
