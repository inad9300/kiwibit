#!/usr/bin/env python3

import os
import sys

os.system('clear')
args = sys.argv[1:]

compiler_flags = '-std=c++17'
compiler_paths = ''
linker_flags = '-pthread -lmysqlcppconn'

if '--release' in args:
    compiler_flags += ' -march=native -O3 -DNDEBUG'
else:
    compiler_flags += ' -Wall -Wextra -pedantic -g -Og -pipe'

build_cmd = (
    'g++ ' + compiler_flags
    + ' ' + compiler_paths
    + ' -o bin/server src/main.cpp'
    + ' ' + linker_flags
)

print('Building system... ')
err = os.system(build_cmd)
if err:
    sys.exit(err)

print('\nRunning static code analysis...')
err = os.system('cppcheck --enable=all --suppress=missingIncludeSystem src/')
if err:
    sys.exit(err)

err = os.system('scan-build "' + build_cmd + '"')
if err:
    sys.exit(err)

if '--skip-tests' not in args:
    pass # TODO

if '--run' in args:
    print('\nRunning...')
    os.system('cd bin && ./server')
