import * as http from 'http'
import * as mysql from 'mysql'
import * as querystring from 'querystring'
import {GenderString} from '../../shared/db/model'
import * as contract from '../../shared/contract'
import * as secrets from '../../shared/secrets'

console.debug('Starting execution.')

const db = mysql.createPool({
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
    console.debug('HTTP request', req.url)

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:1234')

    if (/^\/api\/foods\/[0-9]+$/.test(req.url!)) {
        const foodId = req.url!.match(/^\/api\/foods\/([0-9]+)$/)![1]
        findFoodById(foodId)
            .then(foodDetails => write(res, 200, foodDetails))
            .catch(err => write(res, 500, err))
    }
    else if (/^\/api\/rdis\?/.test(req.url!)) {
        const urlParams = getUrlParams(req.url!)
        const ageStr = urlParams.age
        if (!ageStr || typeof ageStr !== 'string' || !/[0-9]+/.test(ageStr)) {
            return write(res, 400, {message: `Parameter "age" must be numeric.`})
        }
        const age = parseInt(ageStr, 10)
        if (age < 0 || age > 150) {
            return write(res, 400, {message: `Parameter "age" must be between 0 and 150.`})
        }
        const gender = urlParams.gender
        if (typeof gender !== 'string' || (gender !== 'M' && gender !== 'F')) {
            return write(res, 400, {message: `Parameter "gender" must be either "M" or "F".`})
        }
        findRdisByAgeAndGender(age, gender)
            .then(rdis => write(res, 200, rdis))
            .catch(err => write(res, 500, err))
    }
    else if (/^\/api\/foods\/search\?/.test(req.url!)) {
        const urlParams = getUrlParams(req.url!)
        const name = urlParams.name
        if (!name || typeof name !== 'string' || name.length <= 2) {
            return write(res, 400, {message: `Parameter "name" is too short.`})
        }
        const groupIdStr = urlParams.groupId
        if (groupIdStr && (typeof groupIdStr !== 'string' || !/[0-9]+/.test(groupIdStr))) {
            return write(res, 400, {message: `Parameter "groupId" must be numeric.`})
        }
        const groupId = groupIdStr
            ? parseInt(groupIdStr, 10)
            : undefined
        findFoodsByNameAndGroup(name, groupId)
            .then(foods => write(res, 200, foods))
            .catch(err => write(res, 500, err))
    }
    else if (/^\/api\/foods\/groups$/.test(req.url!)) {
        findFoodGroups()
            .then(cats => write(res, 200, cats))
            .catch(err => write(res, 500, err))
    }
    else if (/^\/api\/nutrients$/.test(req.url!)) {
        findNutrients()
            .then(nutrs => write(res, 200, nutrs))
            .catch(err => write(res, 500, err))
    }
    else if (/^\/api\/nutrients\/[0-9]+\/foods$/.test(req.url!)) {
        const nutrientId = req.url!.match(/^\/api\/nutrients\/([0-9]+)\/foods$/)![1]
        findTopFoodsForNutrient(nutrientId)
            .then(foods => write(res, 200, foods))
            .catch(err => write(res, 500, err))
    }
    else {
        write(res, 404, {message: `There is no handler for end-point "${req.url}".`})
    }
}

function write(res: http.ServerResponse, statusCode: number, body: object) {
    console.debug('HTTP response', statusCode, body)
    res.writeHead(statusCode, {'Content-Type': 'application/json; charset=utf-8'})
    res.end(JSON.stringify(body))
}

function getUrlParams(url: string) {
    return querystring.parse(url.substr(url.indexOf('?') + 1))
}

function findFoodById(foodId: string): Promise<contract.FoodDetails> {
    return new Promise((resolve, reject) => {
        db.query(`
            select fd.Long_Desc, fg.FdGrp_Desc, fg.color, ndt.Nutr_Val, ndf.NutrDesc, ndf.display_name
            from food_des fd
            join nut_data ndt on (ndt.NDB_No = fd.NDB_No)
            join nutr_def ndf on (ndf.Nutr_No = ndt.Nutr_No)
            join fd_group fg on (fg.FdGrp_Cd = fd.FdGrp_Cd)
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
                    FdGrp_Desc: foodDetails[0].FdGrp_Desc,
                    color: foodDetails[0].color,
                    nutrients: foodDetails.map((d: any) => ({
                        Nutr_Val: d.Nutr_Val,
                        NutrDesc: d.NutrDesc,
                        display_name: d.display_name
                    }))
                })
            }
        })
    })
}

function findRdisByAgeAndGender(age: number, gender: GenderString): Promise<contract.Rdi[]> {
    return new Promise((resolve, reject) => {
        db.query(`
            select tuil.nutr_no, tuil.value
            from tuil
            where tuil.age_min <= ?
            and tuil.age_max >= ?
            and tuil.gender = ?
            and tuil.pregnancy = 'N'
            and tuil.lactation = 'N'
        `, [age, age, gender], (tuilsErr, tuils: any[]) => {
            db.query(`
                select rdi.value, ndf.NutrDesc, ndf.Units, ndf.Nutr_No
                from rdi
                join nutr_def ndf on (ndf.Nutr_No = rdi.nutr_no)
                where ndf.interest >= 10
                and rdi.age_min <= ?
                and rdi.age_max >= ?
                and rdi.gender = ?
                and rdi.pregnancy = 'N'
                and rdi.lactation = 'N'
                order by ndf.NutrDesc
            `, [age, age, gender], (rdisErr, rdis: any[]) => {
                if (rdisErr) {
                    reject(rdisErr)
                } else if (rdis.length === 0) {
                    reject(new Error(`No RDI information found for ${age}-years-old ${gender === 'M' ? 'males' : 'females'}.`))
                } else {
                    if (!tuilsErr) {
                        rdis.forEach(rdi => {
                            const tuil = tuils.find(tuil => tuil.nutr_no === rdi.Nutr_No)
                            if (tuil) {
                                rdi.max = tuil.value
                            }
                        })
                    } else {
                        console.error(tuilsErr)
                    }
                    resolve(rdis)
                }
            })
        })
    })
}

function findFoodsByNameAndGroup(name: string, groupId?: number): Promise<contract.FoundFood[]> {
    return new Promise((resolve, reject) => {
        const params: (number | string)[] = ['%' + name + '%']
        if (groupId) {
            params.push(groupId)
        }

        db.query(`
            select fd.NDB_No, fd.Long_Desc, fg.FdGrp_Desc, fg.color
            from food_des fd
            join fd_group fg on (fg.FdGrp_Cd = fd.FdGrp_Cd)
            where fg.interest >= 10
            and lower(fd.Long_Desc) like lower(?)
            ${groupId ? 'and fg.FdGrp_Cd = ?' : ''}
            limit 100
        `, params, (err, foods) => {
            if (err) {
                reject(err)
            } else {
                resolve(foods)
            }
        })
    })
}

function findFoodGroups(): Promise<contract.FoodGroup[]> {
    return new Promise((resolve, reject) => {
        db.query(`
            select fg.FdGrp_Cd, fg.FdGrp_Desc
            from fd_group fg
            where fg.interest >= 10
            order by fg.FdGrp_Desc
        `, [], (err, cats) => {
            if (err) {
                reject(err)
            } else {
                resolve(cats)
            }
        })
    })
}

function findNutrients(): Promise<contract.Nutrient[]> {
    return new Promise((resolve, reject) => {
        db.query(`
            select ndf.Nutr_No, ndf.NutrDesc, ndf.Units, ndf.display_name
            from nutr_def ndf
            where ndf.interest >= 10
            order by coalesce(ndf.display_name, ndf.NutrDesc)
        `, [], (err, cats) => {
            if (err) {
                reject(err)
            } else {
                resolve(cats)
            }
        })
    })
}

function findTopFoodsForNutrient(nutrientId: string): Promise<contract.TopFood[]> {
    return new Promise((resolve, reject) => {
        db.query(`
            select fd.NDB_No, fd.Long_Desc, nd.Nutr_Val, ndf.Units, fg.FdGrp_Desc, fg.color
            from food_des fd
            join nut_data nd on (nd.NDB_No = fd.NDB_No)
            join fd_group fg on (fg.FdGrp_Cd = fd.FdGrp_Cd)
            join nutr_def ndf on (nd.Nutr_No = ndf.Nutr_No)
            where ndf.Nutr_No = ?
            and fg.interest >= 10
            and (nd.Add_Nutr_Mark is null or nd.Add_Nutr_Mark != 'Y')
            order by nd.Nutr_Val desc
            limit 200
        `, [nutrientId], (err, cats) => {
            if (err) {
                reject(err)
            } else {
                resolve(cats)
            }
        })
    })
}
