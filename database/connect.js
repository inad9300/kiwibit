#!/usr/bin/env node

// FIXME

const {spawn} = require('child_process')
const secrets = require('../secrets')

const connStr = `"host=localhost port=5432 dbname=usda28 user=kiwibit password='${secrets.db}'"`
spawn(`sudo -u postgres psql ${connStr}`, [], {stdio: 'inherit'})
