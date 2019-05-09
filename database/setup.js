#!/usr/bin/env node

const {execSync} = require('child_process')
const {psqlAnon, psqlAuth} = require('./setup.utils')

console.log('> Installing dependencies.')
{
    execSync('apt-get update')
    execSync('apt-get install libc6 postgresql postgresql-contrib')
}

console.log('> Creating database.')
{
    const config = require('./config')
    const secrets = require('../secrets')
    psqlAnon(`-c "drop database if exists ${config.name}"`)
    psqlAnon(`-c "drop role if exists ${config.user}"`)
    psqlAnon(`-c "create role ${config.user} superuser login encrypted password '${secrets.db}'"`)
    psqlAnon(`-c "create database ${config.name} owner ${config.user} encoding 'UTF8'"`)
    psqlAuth(`-c "alter schema public owner to ${config.user}"`)
}

console.log('> Creating external schemas.')
{
    execSync('./setup.usda.js', {stdio: 'inherit'})
}

console.log('> Creating main schema.')
{
    psqlAuth(`-f schema.sql`)
}

console.log('> Loading data.')
{
    console.log('    > Static data.')
    psqlAuth(`-f data.static.sql`)

    console.log('    > USDA data.')
    psqlAuth(`-f data.usda.sql`)

    console.log('    > RDI values.')
    psqlAuth(`-f data.rdi.sql`)

    console.log('    > UL values.')
    psqlAuth(`-f data.ul.sql`)
}

console.log('> Applying schema changes.')
{
    const fs = require('fs')
    process.chdir('./changes/next')
    fs.readdirSync('.').sort().forEach(file => {
        console.log(`    > Processing ${file}.`)
        psqlAuth(`-f ${file}`)
    })
}
