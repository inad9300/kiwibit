#!/bin/bash
clear

echo "Creating directory structure..."
mkdir obj/

echo "Installing dependencies..."
apt install cppcheck libmysqlcppconn-dev # libboost-all-dev

echo "Done!"
