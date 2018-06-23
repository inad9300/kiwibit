#!/usr/bin/env python3

import getpass
import MySQLdb
import os

os.system('clear')

pwd = getpass.getpass('Database password: ')

db = MySQLdb.connect(
    host = 'localhost',
    user = 'root',
    passwd = pwd,
    db = 'usdanlsr28'
)

cursor = db.cursor()

code = (
    '#pragma once\n\n'
    + 'namespace usda {\n\n'
)

cursor.execute('show tables')
for (table,) in cursor.fetchall():
    print('Processing table ' + table + '...')
    code += 'struct ' + table + ' {\n'

    cursor.execute('show fields from ' + table)
    for (field, col_type, is_null, key, default, extra) in cursor.fetchall():
        code += '    static constexpr const char* ' + field + ' = "' + field + '";\n'

    code += '};\n\n'

code += '}\n'

with open('tables.cpp', 'w+') as f:
    f.write(code)

db.close()
