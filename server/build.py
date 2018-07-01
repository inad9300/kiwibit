#!/usr/bin/env python3

import os
import sys

def run(cmd):
    err = os.system(cmd)
    if err:
        sys.exit(err)

def list_files(dir, ext):
    all_files = []
    for (dirpath, dirnames, filenames) in os.walk(dir):
        all_files += [dirpath + '/' + f for f in filenames if f.endswith(ext)]
    return all_files

os.system('clear')
args = sys.argv[1:]

compiler_flags = '-std=c++17'
compiler_paths = '-I./lib/GSL/include'
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

if '--test' not in args:
    print('\nBuilding system...')
    run(build_cmd)

if '--scan' in args:
    print('\nRunning static code analysis...')
    run('cppcheck --enable=all --suppress=missingIncludeSystem src/')
    run('scan-build "' + build_cmd + '"')

if '--test' in args:
    print('\nRunning unit tests...')

    test_files = list_files('./test', '.cpp')
    for f in test_files:
        print('- Compiling "' + f + '"...')
        run(
            'g++ ' + compiler_flags
            + ' ' + compiler_paths
            + ' -o bin/test ' + f
            + ' ' + linker_flags
        )

        print('- Running "' + f + '"...')
        run('./bin/test')

if '--run' in args:
    print('\nRunning server...')
    run('cd bin && ./server')
