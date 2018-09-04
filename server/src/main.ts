import * as http from 'http'
import * as mysql from 'mysql'
import * as querystring from 'querystring'
import {GenderString} from '../../shared/db/model'
import * as contract from '../../shared/contract'
import * as secrets from '../../shared/secrets'

console.debug('Starting execution.')

const db: mysql.Pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    password: secrets.usda_db,
    user: 'root',
    database: 'usdanlsr28',
    connectionLimit: 16
})

http
    .createServer(server)
    .listen(4000, () => console.debug('Server up and running on port 4000.'))
    .on('error', err => console.error('Server failed to start.', err))

function server(req: http.IncomingMessage, res: http.ServerResponse) {
    console.debug('URL:', req.url)

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:1234')

    if (/^\/api\/foods\/[0-9]+$/.test(req.url!)) {
        const foodId = req.url!.match(/^\/api\/foods\/([0-9]+)$/)![1]
        findFoodById(foodId)
            .then(foodDetails => {
                res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
                return res.end(JSON.stringify(foodDetails))
            })
            .catch(err => {
                console.error(err)
                res.writeHead(500)
                return res.end()
            })
    }
    else if (/^\/api\/rdis\?/.test(req.url!)) {
        const urlParams = getUrlParams(req.url!)
        const ageStr = urlParams.age
        if (!ageStr || typeof ageStr !== 'string' || !/[0-9]+/.test(ageStr)) {
            res.writeHead(400)
            return res.end()
        }
        const age = parseInt(ageStr, 10)
        if (age < 0 || age > 150) {
            res.writeHead(400)
            return res.end()
        }

        const gender = urlParams.gender
        if (typeof gender !== 'string' || (gender !== 'M' && gender !== 'F')) {
            res.writeHead(400)
            return res.end()
        }

        findRdisByAgeAndGender(age, gender)
            .then(rdis => {
                res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
                return res.end(JSON.stringify(rdis))
            })
            .catch(err => {
                console.error(err)
                res.writeHead(500)
                return res.end()
            })
    }
    else if (/^\/api\/foods\/search\?/.test(req.url!)) {
        const name = getUrlParams(req.url!).name
        if (!name || typeof name !== 'string' || name.length <= 2) {
            res.writeHead(400)
            return res.end()
        }

        findFoodsByName(name)
            .then(foods => {
                res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
                return res.end(JSON.stringify(foods))
            })
            .catch(err => {
                console.error(err)
                res.writeHead(500)
                return res.end()
            })
    }
    else {
        res.writeHead(404)
        return res.end()
    }
}

function getUrlParams(url: string) {
    return querystring.parse(url.substr(url.indexOf('?') + 1))
}

function findFoodById(foodId: string): Promise<contract.FoodDetails> {
    return new Promise((resolve, reject) => {
        db.query(`
            select fd.Long_Desc, ndt.Nutr_Val, ndf.NutrDesc
            from food_des fd
            join nut_data ndt on (ndt.NDB_No = fd.NDB_No)
            join nutr_def ndf on (ndf.Nutr_No = ndt.Nutr_No)
            where fd.NDB_No = ?
            order by ndf.NutrDesc
        `, [foodId], (err, foodDetails) => {
            if (err) {
                reject(err)
            } else if (foodDetails.length === 0) {
                reject(new Error(`No food found with id "${foodId}".`))
            } else {
                resolve({
                    Long_Desc: foodDetails[0].Long_Desc,
                    nutrients: foodDetails.map((d: any) => ({
                        Nutr_Val: d.Nutr_Val,
                        NutrDesc: d.NutrDesc
                    }))
                })
            }
        })
    })
}

function findRdisByAgeAndGender(age: number, gender: GenderString): Promise<contract.Rdi[]> {
    console.debug(age, gender)

    return new Promise((resolve, reject) => {
        db.query(`
            select rdi.value, ndf.NutrDesc, ndf.Units
            from rdi
            join nutr_def ndf on (ndf.Nutr_No = rdi.nutr_no)
            where rdi.age_min <= ?
            and rdi.age_max >= ?
            and rdi.gender = ?
            order by ndf.NutrDesc
        `, [age, age, gender], (err, rdis) => {
            if (err) {
                reject(err)
            } else if (rdis.length === 0) {
                reject(new Error(`No RDI information found for ${age}-years-old ${gender === 'M' ? 'males' : 'females'}.`))
            } else {
                resolve(rdis)
            }
        })
    })
}

function findFoodsByName(name: string): Promise<contract.FoundFood[]> {
    return new Promise((resolve, reject) => {
        db.query(`
            select fd.NDB_No, fd.Long_Desc, fg.FdGrp_Desc
            from food_des fd
            join fd_group fg on (fg.FdGrp_Cd = fd.FdGrp_Cd)
            where fg.interest >= 10
            and lower(fd.Long_Desc) like lower(?)
            limit 100
        `, ['%' + name + '%'], (err, foods) => {
            if (err) {
                reject(err)
            } else {
                resolve(foods)
            }
        })
    })
}
