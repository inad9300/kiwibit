#!/usr/bin/env node

const {execSync} = require('child_process')
const config = require('./config')
const {psqlAuth} = require('./setup.utils')

const schema = 'usda'

console.log('> Installing dependencies.')
{
    execSync('apt-get update')
    execSync('apt-get install wget unzip dos2unix')
}

console.log('> Downloading raw data from https://ndb.nal.usda.gov/ndb/.')
{
    execSync(`rm -rf data.${schema}`)
    execSync(`mkdir data.${schema}`)
    process.chdir(`data.${schema}`)
    execSync('wget https://www.ars.usda.gov/ARSUserFiles/80400525/Data/SR-Legacy/SR-Leg_ASC.zip')
    execSync('unzip SR-Leg_ASC.zip')
    execSync('rm *.zip *.pdf')
    execSync('dos2unix *.txt')
    process.chdir('..')
}

console.log('> Creating schema.')
{
    psqlAuth(`-c "drop schema if exists ${schema}"`)
    psqlAuth(`-c "create schema ${schema} authorization ${config.user}"`)
    psqlAuth(`-f schema.${schema}.sql`)
}

console.log('> Loading data.')
{
    process.chdir(`data.${schema}`)
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
        psqlAuth(`-c "copy ${schema}.${table} from '${process.cwd()}/${file}' csv delimiter '^' null '' quote '~' encoding 'UTF8'"`)
    })
    execSync('rm *.old')
}
