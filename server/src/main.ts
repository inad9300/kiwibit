import * as http from 'http'
import * as mysql from 'mysql'
import * as bcrypt from 'bcrypt'
import * as querystring from 'querystring'
import * as dbm from '../../shared/db/model'
import * as api from '../../shared/api'
import * as secrets from '../../shared/secrets'

console.debug('Starting execution.')

declare global {
    interface Error {
        toJSON?(): {msg: string}
    }
}

Error.prototype.toJSON = function () {
    return {msg: this.message}
}

const db = mysql.createPool({
    host: 'localhost',
    port: 3306,
    password: secrets.db,
    user: 'root',
    database: 'usda28',
    connectionLimit: 16
})

http
    .createServer(server)
    .listen(4000, () => console.debug('Server up and running on port 4000.'))
    .on('error', err => console.error('Server failed to start.', err))

function server(req: http.IncomingMessage, res: http.ServerResponse) {
    req.on('error', err => write(res, 500, err))

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:1234')
    res.setHeader('Access-Control-Allow-Methods', 'POST,PUT,DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Authorization')

    if (req.method === 'OPTIONS') {
        res.writeHead(200)
        return res.end()
    }

    const GET = req.method === 'GET'
    const POST = req.method === 'POST'
    const PUT = req.method === 'PUT'
    const DELETE = req.method === 'DELETE'

    console.debug('HTTP request', req.method, req.url)

    if (GET && /^\/api\/foods\/[0-9]+$/.test(req.url!)) {
        const foodId = req.url!.match(/^\/api\/foods\/([0-9]+)$/)![1]
        findFoodById(foodId)
            .then(data => write(res, 200, data))
            .catch(err => write(res, 500, err))
    }
    else if (GET && req.url!.startsWith('/api/rdis?')) {
        const urlParams = getUrlParams(req.url!)
        const ageStr = urlParams.age
        if (!ageStr || typeof ageStr !== 'string' || !/[0-9]+/.test(ageStr)) {
            return write(res, 400, {msg: `Parameter "age" must be numeric.`})
        }
        const age = parseInt(ageStr)
        if (age < 0 || age > 150) {
            return write(res, 400, {msg: `Parameter "age" must be between 0 and 150.`})
        }
        const gender = urlParams.gender
        if (typeof gender !== 'string' || (gender !== 'M' && gender !== 'F')) {
            return write(res, 400, {msg: `Parameter "gender" must be either "M" or "F".`})
        }
        findRdisByAgeAndGender(age, gender)
            .then(data => write(res, 200, data))
            .catch(err => write(res, 500, err))
    }
    else if (GET && req.url!.startsWith('/api/foods/search?')) {
        const urlParams = getUrlParams(req.url!)
        const name = urlParams.name
        if (!name || typeof name !== 'string' || name.length <= 2) {
            return write(res, 400, {msg: `Parameter "name" is too short.`})
        }
        const groupIdStr = urlParams.groupId
        if (groupIdStr && (typeof groupIdStr !== 'string' || !/[0-9]+/.test(groupIdStr))) {
            return write(res, 400, {msg: `Parameter "groupId" must be numeric.`})
        }
        const groupId = groupIdStr
            ? parseInt(groupIdStr)
            : undefined
        findFoodsByNameAndGroup(name, groupId)
            .then(data => write(res, 200, data))
            .catch(err => write(res, 500, err))
    }
    else if (GET && '/api/foods/groups' === req.url) {
        findFoodGroups()
            .then(data => write(res, 200, data))
            .catch(err => write(res, 500, err))
    }
    else if (GET && '/api/nutrients' === req.url) {
        findNutrients()
            .then(data => write(res, 200, data))
            .catch(err => write(res, 500, err))
    }
    else if (GET && /^\/api\/nutrients\/[0-9]+\/foods(\?per=(gram|calory))?$/.test(req.url!)) {
        const matches = req.url!.match(/^\/api\/nutrients\/([0-9]+)\/foods(?:\?per=(gram|calory))?$/)!
        const nutrientId = matches[1]
        const per = (matches[2] || 'gram') as 'gram' | 'calory'
        findTopFoodsForNutrient(nutrientId, per)
            .then(data => write(res, 200, data))
            .catch(err => write(res, 500, err))
    }
    else if (POST && '/api/me' === req.url) {
        getBody(req)
            .then(body => registerUser(body))
            .then(data => write(res, 201, data))
            .catch(err => write(res, 500, err))
    }
    else if (GET && '/api/me' === req.url) {
        authenticateUser(req)
            .then(data => write(res, 200, data))
            .catch(err => write(res, 500, err))
    }
    else if (PUT && '/api/me' === req.url) {
        Promise
            .all([authenticateUser(req), getBody(req)])
            .then(([user, body]) => {
                body.id = user.id
                return updateUser(body)
            })
            .then(data => write(res, 200, data))
            .catch(err => write(res, 500, err))
    }
    else if (GET && req.url!.startsWith('/api/me/meals?')) {
        const urlParams = getUrlParams(req.url!)
        const dateMs = urlParams.date ? Date.parse(urlParams.date as any) : Date.now()
        if (isNaN(dateMs)) {
            return write(res, 400, {msg: `Invalid date: "${urlParams.date}".`})
        }
        authenticateUser(req)
            .then(user => findWeekMeals(new Date(dateMs), user.id))
            .then(data => write(res, 200, data))
            .catch(err => write(res, 500, err))
    }
    else if (POST && req.url === '/api/me/meals') {
        Promise
            .all([authenticateUser(req), getBody(req)])
            .then(([user, body]) => addMeal(body, user.id))
            .then(data => write(res, 200, data))
            .catch(err => write(res, 500, err))
    }
    else if (PUT && /^\/api\/me\/meals\/[1-9][0-9]*$/.test(req.url!)) {
        Promise
            .all([authenticateUser(req), getBody(req)])
            .then(([user, body]) => {
                const mealId = parseInt(req.url!.match(/^\/api\/me\/meals\/([1-9][0-9]*)$/)![1])
                body.id = mealId
                return updateMeal(body, user.id)
            })
            .then(data => write(res, 200, data))
            .catch(err => write(res, 500, err))
    }
    else if (PUT && /^\/api\/meals\/positions$/.test(req.url!)) {
        Promise
            .all([authenticateUser(req), getBody(req)])
            .then(([user, body]) => {
                const dateMs = Date.parse(body.date)
                if (isNaN(dateMs)) {
                    return Promise.reject(new Error(`Invalid date: "${body.date}".`))
                }
                body.date = new Date(dateMs)
                return updateMealPosition(body, user.id)
            })
            .then(data => write(res, 200, data))
            .catch(err => write(res, 500, err))
    }
    else if (DELETE && /^\/api\/me\/meals\/[1-9][0-9]*$/.test(req.url!)) {
        authenticateUser(req)
            .then(user => {
                const mealId = parseInt(req.url!.match(/^\/api\/me\/meals\/([1-9][0-9]*)$/)![1])
                return deleteMeal(mealId, user.id)
            })
            .then(data => write(res, 204, data))
            .catch(err => write(res, 500, err))
    }
    else {
        write(res, 404, {msg: `There is no handler for end-point "${req.method} ${req.url}".`})
    }
}

// Utils.

function write(res: http.ServerResponse, statusCode: number, body: any) {
    console.debug('HTTP response', statusCode, body)
    res.writeHead(statusCode, {'Content-Type': 'application/json; charset=utf-8'})
    res.end(JSON.stringify(body))
}

function getUrlParams(url: string) {
    return querystring.parse(url.substr(url.indexOf('?') + 1))
}

function getBody(req: http.IncomingMessage): Promise<any> {
    return getRawBody(req).then(body => JSON.parse(body))
}

function getRawBody(req: http.IncomingMessage): Promise<string> {
    return new Promise((resolve, reject) => {
        const body: Buffer[] = []
        req
            .on('error', err => reject(err))
            .on('data', chunk => body.push(chunk))
            .on('end', () => resolve(Buffer.concat(body).toString()))
    })
}

function select<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, results) => {
            err ? reject(err) : resolve(results)
        })
    })
}

function insert(tableName: string, data: object): Promise<number> {
    return new Promise((resolve, reject) => {
        db.query(`insert into ${tableName} set ?`, data, (err, results) => {
            if (err) {
                reject(err)
            } else if (results.affectedRows === 0) {
                reject(new Error(`Failed to insert data in "${tableName}".`))
            } else {
                resolve(results.insertId)
            }
        })
    })
}

interface WriteQueryResult {
    affectedRows: number
}

function update(sql: string, dataAndParams: any[]): Promise<WriteQueryResult> {
    return new Promise((resolve, reject) => {
        db.query(sql, dataAndParams, (err, results) => {
            err ? reject(err) : resolve(results)
        })
    })
}

function remove(sql: string, params: any[]): Promise<WriteQueryResult> {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, results) => {
            err ? reject(err) : resolve(results)
        })
    })
}

// End-point handlers.

function findFoodById(foodId: string): Promise<api.FoodDetails> {
    return select(`
        select fd.Long_Desc, fg.FdGrp_Desc, fg.color, ndt.Nutr_Val, ndf.NutrDesc, ndf.display_name
        from food_des fd
        join nut_data ndt on (ndt.NDB_No = fd.NDB_No)
        join nutr_def ndf on (ndf.Nutr_No = ndt.Nutr_No)
        join fd_group fg on (fg.FdGrp_Cd = fd.FdGrp_Cd)
        where fd.NDB_No = ?
        order by ndf.NutrDesc
    `, [foodId]).then(data => {
        if (data.length === 0) {
            throw new Error(`No food found with id "${foodId}".`)
        } else {
            return {
                Long_Desc: data[0].Long_Desc,
                FdGrp_Desc: data[0].FdGrp_Desc,
                color: data[0].color,
                nutrients: data.map((d: any) => ({
                    Nutr_Val: d.Nutr_Val,
                    NutrDesc: d.NutrDesc,
                    display_name: d.display_name
                }))
            }
        }
    })
}

function findRdisByAgeAndGender(age: number, gender: dbm.GenderString): Promise<api.Rdi[]> {
    const tuilsSelect = select(`
        select tuil.nutr_no, tuil.value
        from tuil
        where tuil.age_min <= ?
        and tuil.age_max >= ?
        and tuil.gender = ?
        and tuil.pregnancy = 'N'
        and tuil.lactation = 'N'
    `, [age, age, gender])
    const rdisSelect = select(`
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
    `, [age, age, gender])
    return Promise.all([tuilsSelect, rdisSelect]).then(([tuils, rdis]) => {
        if (rdis.length === 0) {
            throw new Error(`No RDI information found for ${age}-years-old ${gender === 'M' ? 'males' : 'females'}.`)
        }
        rdis.forEach(rdi => {
            const tuil = tuils.find(tuil => tuil.nutr_no === rdi.Nutr_No)
            if (tuil) {
                rdi.max = tuil.value
            }
        })
        return rdis
    })
}

function findFoodsByNameAndGroup(name: string, groupId?: number): Promise<api.FoundFood[]> {
    const params: (number | string)[] = ['%' + name + '%']
    if (groupId) {
        params.push(groupId)
    }
    return select(`
        select fd.NDB_No, fd.Long_Desc, fg.FdGrp_Desc, fg.color
        from food_des fd
        join fd_group fg on (fg.FdGrp_Cd = fd.FdGrp_Cd)
        where fg.interest >= 10
        and lower(fd.Long_Desc) like lower(?)
        ${groupId ? 'and fg.FdGrp_Cd = ?' : ''}
        limit 100
    `, params)
}

function findFoodGroups(): Promise<api.FoodGroup[]> {
    return select(`
        select fg.FdGrp_Cd, fg.FdGrp_Desc
        from fd_group fg
        where fg.interest >= 10
        order by fg.FdGrp_Desc
    `)
}

function findNutrients(): Promise<api.Nutrient[]> {
    return select(`
        select ndf.Nutr_No, ndf.NutrDesc, ndf.Units, ndf.display_name
        from nutr_def ndf
        where ndf.interest >= 10
        order by coalesce(ndf.display_name, ndf.NutrDesc)
    `)
}

function findTopFoodsForNutrient(nutrientId: string, per: 'gram' | 'calory'): Promise<api.TopFood[]> {
    const orderBy = per === 'gram'
        ? `nd.Nutr_Val`
        : `if(nd.Nutr_No = '208', nd.Nutr_Val, (100 * nd.Nutr_Val) / (
               select in_nd.Nutr_Val
               from nut_data in_nd
               where in_nd.Nutr_No = '208'
               and in_nd.NDB_No = nd.NDB_No
           ))`
    return select(`
        select fd.NDB_No, fd.Long_Desc, ndf.Units, fg.FdGrp_Desc, fg.color, ${orderBy} Nutr_Val
        from food_des fd
        join nut_data nd on (nd.NDB_No = fd.NDB_No)
        join fd_group fg on (fg.FdGrp_Cd = fd.FdGrp_Cd)
        join nutr_def ndf on (nd.Nutr_No = ndf.Nutr_No)
        where ndf.Nutr_No = ?
        and fg.interest >= 10
        and (nd.Add_Nutr_Mark is null or nd.Add_Nutr_Mark != 'Y')
        order by ${orderBy} desc
        limit 200
    `, [nutrientId])
}

function authenticateUser(req: http.IncomingMessage): Promise<api.User> {
    const auth = req.headers.authorization
    if (!auth || auth.indexOf('Basic ') !== 0) {
        return Promise.reject(new Error('Wrong authentication format.'))
    }
    const idAndPwd = Buffer.from(auth.split(' ')[1], 'base64').toString()
    const [idStr, pwd] = idAndPwd.split(':')
    const id = parseInt(idStr)
    if (isNaN(id) || !pwd) {
        return Promise.reject(new Error('Wrong authentication format.'))
    }
    return select(`
        select u.id, u.name, u.email, u.pwd, u.age, u.gender, u.pregnancy, u.lactation,
            u.activity_lvl, u.weight, u.height
        from users u
        where u.id = ?
    `, [id]).then(data => {
        if (data.length === 0) {
            throw new Error(`No user found with id "${id}".`)
        }
        const user = data[0] as api.User & {pwd: dbm.users['pwd']}
        return bcrypt.compare(pwd, user.pwd).then(same => {
            if (!same) {
                throw new Error('Wrong credentials.')
            }
            delete user.pwd
            return user
        })
    })
}

function registerUser(user: api.NewUser): Promise<number> {
    return bcrypt.hash(user.pwd, 10)
        .then(hash => insert('users', {...user, pwd: hash}))
}

function updateUser(user: api.NewUser & {id: number}): Promise<void> {
    return update(`
        update users u set
            u.name = ?,
            u.age = ?,
            u.gender = ?,
            u.pregnancy = ?,
            u.lactation = ?,
            u.activity_lvl = ?,
            u.weight = ?,
            u.height = ?
        where u.id = ?
    `, [
        user.name,
        user.age,
        user.gender,
        user.pregnancy,
        user.lactation,
        user.activity_lvl,
        user.weight,
        user.height,
        user.id
    ]).then(results => {
        if (results.affectedRows === 0) {
            throw new Error(`No user found with id "${user.id}".`)
        }
    })
}

function findWeekMeals(date: Date, userId: number): Promise<api.Meal[]> {
    return select(`
        select ml.id, ml.date, ml.type, ml.qty, ml.eaten, ml.dorder, fd.NDB_No, fd.Long_Desc
        from meals ml
        join food_des fd on (fd.NDB_No = ml.NDB_No)
        where ml.user_id = ?
        and yearweek(ml.date, 3) = yearweek(?, 3)
    `, [userId, date])
}

function addMeal(meal: api.NewMeal, user_id: number): Promise<number> {
    return insert('meals', {...meal, user_id})
}

function updateMeal(meal: api.NewMeal & {id: number}, userId: number): Promise<void> {
    return update(`
        update meals ml set
            ml.type = ?,
            ml.qty = ?,
            ml.eaten = ?,
            ml.NDB_No = ?,
        where ml.id = ?
        and ml.user_id = ?
    `, [
        meal.type,
        meal.qty,
        meal.eaten,
        meal.NDB_No,
        meal.id,
        userId
    ]).then(results => {
        if (results.affectedRows === 0) {
            throw new Error(`No meal found with id "${meal.id}" for user "${userId}".`)
        }
    })
}

function updateMealPosition(newMeal: api.MealPosition & {date: Date}, userId: number): Promise<void> {
    return select(`select * from meals where id = ? and user_id = ?`, [newMeal.id, userId]).then(data => {
        if (data.length === 0) {
            throw new Error(`No meal found with id "${newMeal.id}" for user "${userId}".`)
        }
        const oldMeal = data[0] as dbm.meals
        const dateChanged = oldMeal.date.getTime() !== newMeal.date.getTime()
        const dorderChanged = oldMeal.dorder !== newMeal.dorder
        if (!dateChanged && !dorderChanged) {
            return
        }
        const sameDayMealsSql = `select * from meals where date = ?`
        return Promise.all([
            select(sameDayMealsSql, [oldMeal.date]),
            select(sameDayMealsSql, [newMeal.date])
        ]).then(([_oldMealsSameDay, _newMealsSameDay]) => {
            // TODO
        })
    })
}

function deleteMeal(mealId: number, userId: number): Promise<void> {
    return remove(`
        delete from meals
        where id = ?
        and user_id = ?
    `, [mealId, userId]).then(results => {
        if (results.affectedRows === 0) {
            throw new Error(`No meal found with id "${mealId}" for user "${userId}".`)
        }
    })
}
