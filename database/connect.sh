#!/bin/bash

config=$(cat ./config.js)
secrets=$(cat ../secrets.js)

pattern="\s+host:\s+'([-_:/.a-zA-Z0-9]+)'"
[[ $config =~ $pattern ]] && host=${BASH_REMATCH[1]}

pattern="\s+port:\s+([0-9]+)"
[[ $config =~ $pattern ]] && port=${BASH_REMATCH[1]}

pattern="\s+user:\s+'([a-zA-Z0-9]+)'"
[[ $config =~ $pattern ]] && user=${BASH_REMATCH[1]}

pattern="\s+name:\s+'([a-zA-Z0-9]+)'"
[[ $config =~ $pattern ]] && name=${BASH_REMATCH[1]}

pattern="\s+db:\s+'([a-zA-Z0-9]+)'"
[[ $secrets =~ $pattern ]] && pwd=${BASH_REMATCH[1]}

sudo -u postgres psql "host=$host port=$port user=$user dbname=$name password='$pwd'"
