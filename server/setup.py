#!/usr/bin/env python3

import os

os.system(
    'sudo apt install'
        + ' cppcheck'
        + ' llvm clang'
        + ' mysql-server mysql-client libmysqlcppconn-dev'
        + ' python3-pip'
        + ' python-mysqldb libmysqlclient-dev'
)
os.system('sudo -H pip3 install mysqlclient')
os.system('mysql_secure_installation')
