const {execSync} = require('child_process')
const config = require('./config')
const secrets = require('../secrets')

const psqlAnon = cmd => execSync(`sudo -u postgres psql ${cmd}`)
const psqlAuth = cmd => execSync(`sudo -u postgres psql "host=${config.host} port=${config.port} user=${config.user} dbname=${config.name} password='${secrets.db}'" ${cmd}`)

module.exports = {psqlAnon, psqlAuth}
