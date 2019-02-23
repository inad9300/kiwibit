#!/usr/bin/env node

const fs = require('fs')
const {execSync} = require('child_process')
const secrets = require('../secrets')

// Data source: https://ndb.nal.usda.gov/ndb/.

console.log('> Installing dependencies.')
{
    execSync('apt-get install wget unzip dos2unix libc6 postgresql postgresql-contrib')
}

if (process.argv.includes('download')) {
    console.log('> Downloading raw data.')

    execSync('rm -rf data')
    execSync('mkdir data')
    process.chdir('data')
    execSync('wget https://www.ars.usda.gov/ARSUserFiles/80400525/Data/SR-Legacy/SR-Leg_ASC.zip')
    execSync('unzip SR-Leg_ASC.zip')
    execSync('rm *.zip *.pdf')
    execSync('dos2unix *.txt')
    process.chdir('..')
}

function psql(tail, auth) {
    const connStr = `"host=localhost port=5432 dbname=usda28 user=kiwibit password='${secrets.usda_db}'"`
    execSync(`sudo -u postgres psql ${auth ? connStr : ''} ${tail}`)
}

console.log('> Creating database.')
{
    psql(`-c "drop database if exists usda28"`)
    psql(`-c "drop role if exists kiwibit"`)
    psql(`-c "create role kiwibit superuser login encrypted password '${secrets.usda_db}'"`)
    psql(`-c "create database usda28 owner kiwibit encoding 'UTF8'"`)
    psql(`-f schema.sql`, true)
}

console.log('> Loading data.')
{
    process.chdir('data')
    ;[
        'src_cd',
        'deriv_cd',
        'data_src',
        'footnote',
        'langdesc',
        'nutr_def',
        'fd_group',
        'food_des',
        'nut_data',
        'weight',
        'langual',
        'datsrcln'
    ]
    .map(file => file.toUpperCase() + '.txt')
    .forEach(file => {
        console.log(`> Processing ${file}.`)
        execSync(`mv ${file} ${file}.old`)
        execSync(`iconv -f LATIN1 -t UTF-8 ${file}.old -o ${file}`)
        const table = file.slice(0, -('.txt'.length)).toLowerCase()
        psql(`-c "copy ${table} from '${process.cwd()}/${file}' csv delimiter '^' null '' quote '~' encoding 'UTF8'"`, true)
    })
    execSync('rm *.old')
}

console.log('> Applying schema changes.')
{
    process.chdir('../changes')
    fs.readdirSync('.').sort().forEach(file => {
        console.log(`> Processing ${file}.`)
        psql(`-f ${file}`, true)
    })
}
