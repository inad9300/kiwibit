const fs = require('fs')
const {execSync} = require('child_process')
const secrets = require('../secrets')

/**
 * Before running this script, make sure all commands used below are installed,
 * in particular wget, unzip, dos2unix, iconv and mysql.
 *
 * In addition, the following script needs to be executed by hand on the MySQL
 * database (their effects can be reverted once the script has run):
 *
 *     show global variables like 'local_infile';
 *     set global local_infile = 'ON';
 *
 * Source: https://ndb.nal.usda.gov/ndb/.
 */

console.log('> Downloading raw data.')
{
    execSync('rm -r data')
    execSync('mkdir data')
    process.chdir('data')
    execSync('wget https://www.ars.usda.gov/ARSUserFiles/80400525/Data/SR-Legacy/SR-Leg_ASC.zip')
    execSync('unzip SR-Leg_ASC.zip')
    execSync('rm *.zip *.pdf')
    execSync('dos2unix *.txt')
    process.chdir('..')
}

console.log('> Creating schema.')
{
    execSync(`mysql -u root -p"${secrets.usda_db}" < schema.sql`)
}

console.log('> Loading data.')
{
    process.chdir('data')
    fs.readdirSync('.').forEach(file => {
        console.log(`> Processing ${file}.`)
        execSync(`mv ${file} ${file}.old`)
        execSync(`iconv -f LATIN1 -t UTF-8 ${file}.old -o ${file}`)
        const table = file.slice(0, -('.txt'.length))
        const script = `use usdanlsr28; load data local infile '${file}' into table ${table.toLowerCase()} fields terminated by '^' enclosed by '\\~';`
        execSync(`mysql -u root -p"${secrets.usda_db}" --local-infile -e "${script}"`)
    })
    execSync('rm *.old')
}

console.log('> Applying schema changes.')
{
    process.chdir('../changes')
    fs.readdirSync('.').sort().forEach(file => {
        console.log(`> Processing ${file}.`)
        execSync(`mysql -u root -p"${secrets.usda_db}" < ${file}`)
    })
}
