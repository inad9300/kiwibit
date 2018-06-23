#!/bin/bash
clear

# Other potentially useful options (more in http://linux.die.net/man/1/gcc):
# -Wextra
# -mtune=native -march=native
# -O... g - development; 0 - fast compilation; 1, 2, 3, fast - performance; s - size
COMPILATION_FLAGS="-std=c++14 -pipe -g -Og -Wall -pedantic"
INCLUDES="-I/usr/include/cppconn -L/usr/lib -lmysqlcppconn"
# LINKING_FLAGS="-pthread -lboost_system -lboost_filesystem"

echo "Building system..."
g++ -Wall -w -o bin/kiwibit src/main.cpp $COMPILATION_FLAGS $LINKING_FLAGS $INCLUDES

echo "Running static code analysis..."
cppcheck src/ # Documentation in http://cppcheck.sourceforge.net/manual.pdf

echo "Done!"