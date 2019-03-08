#!/usr/bin/env node

const {execSync} = require('child_process')
const config = require('./config')
const secrets = require('../secrets')

const psqlAnon = cmd => execSync(`sudo -u postgres psql ${cmd}`)
const psqlAuth = cmd => psqlAnon(`"host=${config.host} port=${config.port} user=${config.user} dbname=${config.name} password='${secrets.db}'" ${cmd}`)

console.log('> Installing dependencies.')
{
    execSync('apt-get install libc6 postgresql postgresql-contrib')
}

console.log('> Creating database.')
{
    // FIXME Owner of public schema is postgres.
    psqlAnon(`-c "drop database if exists ${config.name}"`)
    psqlAnon(`-c "drop role if exists ${config.user}"`)
    psqlAnon(`-c "create role ${config.user} superuser login encrypted password '${secrets.db}'"`)
    psqlAnon(`-c "create database ${config.name} owner ${config.user} encoding 'UTF8'"`)
    psqlAuth(`-f schema.sql`)
}

console.log('> Creating external schemas.')
{
    require('./setup.usda28')
}

console.log('> Loading data.')
{
    // TODO
}

console.log('> Applying schema changes.')
{
    // TODO
    // const fs = require('fs')
    // process.chdir('./changes')
    // fs.readdirSync('.').sort().forEach(file => {
    //     console.log(`> Processing ${file}.`)
    //     psqlAuth(`-f ${file}`)
    // })
}
