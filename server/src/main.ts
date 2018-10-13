import * as http from 'http'
import * as bcrypt from 'bcrypt'
import {selectMany, insertOne, updateOne, deleteOne} from './db'
import {GenderString, users, meals, food_des, nut_data, nutr_def, fd_group, tuil, rdi} from '../../shared/db/model'
import {Omit} from '../../shared/Types'
import {handle, write, all, err, ok, HttpError, validDate, b64} from './utils'
import {FoodDetails, Rdi, FoundFood, FoodGroup, Nutrient, NutrRefUnit, TopFood, User, NewUser, Meal, NewMeal, MealPosition} from '../../shared/Api'

http
    .createServer(server)
    .listen(4000, () => console.debug('Server up and running on port 4000.'))
    .on('error', err => console.error('Server failed to start.', err))

function server(req: http.IncomingMessage, res: http.ServerResponse) {
    req.on('error', err => {
        console.error('Request error.', err)
        res.writeHead(500)
        res.end()
    })

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:1234')
    res.setHeader('Access-Control-Allow-Methods', 'POST')
    res.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type')

    if (req.method === 'OPTIONS') {
        res.writeHead(200)
        return res.end()
    }
    if (req.method !== 'POST') {
        res.writeHead(405)
        return res.end()
    }

    console.debug('HTTP request', req.url)

    // TODO Leverage errors coming from the DB.

    handle(req, {
        getFoodById: foodId =>
            getFoodById(foodId),
        getFoods: ({name, groupId}) =>
            getFoods(name, groupId),
        getTopFoodsForNutrient: ({nutrientId, unit}) =>
            getTopFoodsForNutrient(nutrientId, unit || 'gram'),

        getRdis: ({age, gender}) =>
            getRdis(age, gender),
        getFoodGroups: () =>
            getFoodGroups(),
        getNutrients: () =>
            getNutrients(),

        getCurrentUser: () =>
            authenticateUser(req),
        registerUser: user =>
            registerUser(user),
        updateUser: body =>
            authenticateUser(req)
                .then(user => updateUser({...body, id: user.id})),

        getWeekMeals: ({date}) =>
            all([
                validDate(date),
                authenticateUser(req)
            ])
            .then(([date, user]) => getWeekMeals(date || new Date, user.id)),
        addMeal: body =>
            authenticateUser(req)
                .then(user => addMeal(body, user.id)),
        updateMeal: meal =>
            authenticateUser(req)
                .then(user => updateMeal(meal, user.id)),
        updateMealPosition: body =>
            all([
                validDate(body.date),
                authenticateUser(req)
            ])
            .then(([date, user]) => updateMealPosition({...body, date}, user.id)),
        deleteMeal: ({mealId}) =>
            authenticateUser(req)
                .then(user => deleteMeal(mealId, user.id))
    })
    .then(data => write(res, 200, data))
    .catch(err => write(res, err instanceof HttpError ? err.code : 500, err))
}

// End-point handlers.

function getFoodById(foodId: string): Promise<FoodDetails> {
    return selectMany<food_des & nut_data & nutr_def & fd_group>(`
        select fd.long_desc, fg.fdgrp_desc, fg.color, nd.nutr_val, ndf.nutrdesc, ndf.display_name
        from food_des fd
        join nut_data nd using (ndb_no)
        join nutr_def ndf using (nutr_no)
        join fd_group fg using (fdgrp_cd)
        where fd.ndb_no = $1
        order by ndf.nutrdesc
    `, [foodId]).then(data => {
        if (data.length === 0) {
            return err(404)
        } else {
            return ok({
                long_desc: data[0].long_desc,
                fdgrp_desc: data[0].fdgrp_desc,
                color: data[0].color,
                nutrients: data.map(d => ({
                    nutr_val: d.nutr_val,
                    nutrdesc: d.nutrdesc,
                    display_name: d.display_name
                }))
            })
        }
    })
}

function getRdis(age: number, gender: GenderString): Promise<Rdi[]> {
    const tuilQuery = selectMany<tuil>(`
        select tuil.nutr_no, tuil.value
        from tuil
        where tuil.age_min <= $1
        and tuil.age_max >= $2
        and tuil.gender = $3
        and tuil.pregnancy = 'N'
        and tuil.lactation = 'N'
    `, [age, age, gender])

    const rdiQuery = selectMany<rdi & nutr_def>(`
        select rdi.value, ndf.nutrdesc, ndf.units, ndf.nutr_no
        from rdi
        join nutr_def ndf using (nutr_no)
        where ndf.interest >= 10
        and rdi.age_min <= $1
        and rdi.age_max >= $2
        and rdi.gender = $3
        and rdi.pregnancy = 'N'
        and rdi.lactation = 'N'
        order by ndf.nutrdesc
    `, [age, age, gender])

    return all([tuilQuery, rdiQuery]).then(([tuils, rdis]) => {
        if (rdis.length === 0) {
            return err(404, `No RDI information found for ${age}-years-old ${gender === 'M' ? 'males' : 'females'}.`)
        }
        rdis.forEach(rdi => {
            const tuil = tuils.find(tuil => tuil.nutr_no === rdi.nutr_no)
            if (tuil) {
                (rdi as any).max = tuil.value
            }
        })
        return ok(rdis)
    })
}

function getFoods(name: string, groupId?: string): Promise<FoundFood[]> {
    const params: string[] = ['%' + name + '%']
    if (groupId) {
        params.push(groupId)
    }
    return selectMany<food_des & fd_group>(`
        select fd.ndb_no, fd.long_desc, fg.fdgrp_desc, fg.color
        from food_des fd
        join fd_group fg using (fdgrp_cd)
        where fg.interest >= 10
        and lower(fd.long_desc) like lower($1)
        ${groupId ? 'and fg.fdgrp_cd = $2' : ''}
        limit 100
    `, params)
}

function getFoodGroups(): Promise<FoodGroup[]> {
    return selectMany<fd_group>(`
        select fg.fdgrp_cd, fg.fdgrp_desc
        from fd_group fg
        where fg.interest >= 10
        order by fg.fdgrp_desc
    `)
}

function getNutrients(): Promise<Nutrient[]> {
    return selectMany<nutr_def>(`
        select ndf.nutr_no, ndf.nutrdesc, ndf.units, ndf.display_name
        from nutr_def ndf
        where ndf.interest >= 10
        order by coalesce(ndf.display_name, ndf.nutrdesc)
    `)
}

function getTopFoodsForNutrient(nutrientId: string, unit: NutrRefUnit): Promise<TopFood[]> {
    const orderBy = unit === 'gram'
        ? `nd.nutr_val`
        : `if(nd.nutr_no = '208', nd.nutr_val, (100 * nd.nutr_val) / (
               select in_nd.nutr_val
               from nut_data in_nd
               where in_nd.nutr_no = '208'
               and in_nd.ndb_no = nd.ndb_no
           ))`
    return selectMany<food_des & nut_data & fd_group & nutr_def>(`
        select fd.ndb_no, fd.long_desc, ndf.Units, fg.FdGrp_Desc, fg.color, ${orderBy} Nutr_Val
        from food_des fd
        join nut_data nd using (ndb_no)
        join fd_group fg using (FdGrp_Cd)
        join nutr_def ndf using (nutr_no)
        where ndf.nutr_no = $1
        and fg.interest >= 10
        and (nd.Add_Nutr_Mark is null or nd.Add_Nutr_Mark != 'Y')
        order by ${orderBy} desc
        limit 200
    `, [nutrientId])
}

function authenticateUser(req: http.IncomingMessage): Promise<User> {
    const auth = req.headers.authorization
    if (!auth || auth.indexOf('Basic ') !== 0) {
        return err(400, 'Wrong authentication format. Basic Authentication expected.')
    }
    const idAndPwd = b64.decode(auth.split(' ')[1])
    const [idStr, pwd] = idAndPwd.split(':')
    const id = parseInt(idStr)
    if (isNaN(id) || !pwd) {
        return err(400, 'Malformed Basic Authentication content found.')
    }
    return selectMany<users>(`
        select u.id, u.name, u.email, u.pwd, u.age, u.gender, u.pregnancy, u.lactation,
            u.activity_lvl, u.weight, u.height
        from users u
        where u.id = $1
    `, [id]).then(data => {
        if (data.length === 0) {
            return err(404, `No user found with id "${id}".`)
        }
        const user = data[0] as User & {pwd: users['pwd']}
        return bcrypt.compare(pwd, user.pwd).then(same => {
            if (!same) {
                return err(401, 'Wrong credentials.')
            }
            return ok(getPublishableUser(user))
        })
    })
}

function registerUser(user: NewUser): Promise<User> {
    return bcrypt.hash(user.pwd, 10)
        .then(hash => insertOne<users>('users', {...user, pwd: hash}))
        .then(user => getPublishableUser(user))
}

function updateUser(user: NewUser & {id: number}): Promise<User> {
    return updateOne<users>('users', {
        name: user.name,
        age: user.age,
        gender: user.gender,
        pregnancy: user.pregnancy,
        lactation: user.lactation,
        activity_lvl: user.activity_lvl,
        weight: user.weight,
        height: user.height
    }, {
        id: user.id
    })
    .then(user => getPublishableUser(user))
}

function getPublishableUser(user: users): User {
    delete user.pwd
    return user
}

function getWeekMeals(date: Date, userId: number): Promise<Meal[]> {
    return selectMany<any /* meals & food_des */>(`
        select ml.id, ml.date, ml.type, ml.qty, ml.eaten, ml.dorder, fd.ndb_no, fd.long_desc
        from meals ml
        join food_des fd using (ndb_no)
        where ml.user_id = $1
        and extract(year from ml.date) = extract(year from to_date($2, 'YYYY-MM-DD'))
        and extract(week from ml.date) = extract(week from to_date($2, 'YYYY-MM-DD'))
        order by ml.date, ml.dorder
    `, [userId, date])
}

function getDayMeals(date: Date, userId: number): Promise<Meal[]> {
    return selectMany<any /* meals & food_des */>(`
        select ml.id, ml.date, ml.type, ml.qty, ml.eaten, ml.dorder, fd.ndb_no, fd.long_desc
        from meals ml
        join food_des fd using (ndb_no)
        where ml.user_id = $1
        and ml.date = to_date($2, 'YYYY-MM-DD')
        order by ml.dorder asc
    `, [userId, date])
}

function addMeal(meal: NewMeal, userId: number): Promise<meals> {
    return validDate(meal.date).then(date =>
        getDayMeals(date, userId)
            .then(meals => Math.max(...meals.map(m => m.dorder).concat(-1)))
            .then(maxOrder => insertOne<meals>('meals', {
                ...meal,
                date,
                user_id: userId,
                dorder: maxOrder + 1
            }))
    )
}

function updateMeal(meal: NewMeal & {id: number}, userId: number): Promise<meals> {
    return updateOne<meals>('meals', {
        type: meal.type,
        qty: meal.qty,
        eaten: meal.eaten,
        ndb_no: meal.ndb_no
    }, {
        id: meal.id,
        user_id: userId
    })
}

function updateMealPosition(_newMeal: Omit<MealPosition, 'date'> & {date: Date}, _userId: number): Promise<void> {
    return Promise.resolve()
    // const sameDayMeals = (date: Date) => selectMany<meals>(`select * from meals where date = $1 and user_id = $2`, [date, userId])

    // selectOne(`select * from meals where id = $1 and user_id = $2`, [newMeal.id, userId])
    //     .then(oldMeal => {
    //         const dateChanged = oldMeal.date.getTime() !== newMeal.date.getTime()
    //         const dorderChanged = oldMeal.dorder !== newMeal.dorder
    //         if (!dateChanged && !dorderChanged) {
    //             return err(400, 'No changes detected.')
    //         }
    //         if (dateChanged) {
    //             // TODO Fill in the gaps!
    //             return deleteOne<meals>('meals', {id: oldMeal.id})
    //         } else {
    //             deleteMany<meals>('meals', {date: oldMeal.date, user_id: userId})
    //                 .then(sameDayMeals => {
    //                     sameDayMeals
    //                         .sort((a, b) => a.dorder - b.dorder)
    //                         .map((meal, idx) => ({...meal, dorder: idx}))
    //                 })
    //         }
    //     })
    //     .then(() => {

    //     })


    // selectOne(`select * from meals where id = $1 and user_id = $2`, [newMeal.id, userId]).then(oldMeal => {
    //     const dateChanged = oldMeal.date.getTime() !== newMeal.date.getTime()
    //     const dorderChanged = oldMeal.dorder !== newMeal.dorder
    //     if (!dateChanged && !dorderChanged) {
    //         return
    //     }
    //     const sameDayMealsSql = `select * from meals where date = $1 and user_id = $2`
    //     return all([
    //         selectMany(sameDayMealsSql, [oldMeal.date, userId]),
    //         selectMany(sameDayMealsSql, [newMeal.date, userId])
    //     ]).then(([_oldMealsSameDay, _newMealsSameDay]) => {
    //         // TODO
    //     })
    // })
}

function deleteMeal(mealId: number, userId: number): Promise<meals> {
    return deleteOne<meals>('meals', {
        id: mealId,
        user_id: userId
    })
}
