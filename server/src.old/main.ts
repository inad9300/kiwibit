// handle(req, {
//     getFoodById,
//     getFoods,
//     getTopFoodsForNutrient,
//
//     getRdis,
//     getFoodGroups,
//     getNutrients,
//
//     registerUser,
//     getUser: () =>
//         authenticateUser(req),
//     updateUser: body =>
//         authenticateUser(req)
//             .then(user => updateUser({...body, id: user.id})),
//
//     getWeekMeals: ({date}) =>
//         Q.all([
//             validDate(date),
//             authenticateUser(req)
//         ])
//         .then(([date, user]) => getWeekMeals(date, user.id)),
//     addMeal: meal =>
//         authenticateUser(req)
//             .then(user => addMeal(meal, user.id)),
//     updateMeal: meal =>
//         authenticateUser(req)
//             .then(user => updateMeal(meal, user.id)),
//     updateMealPosition: body =>
//         Q.all([
//             validDate(body.date),
//             authenticateUser(req)
//         ])
//         .then(([date, user]) => updateMealPosition({...body, date}, user.id)),
//     deleteMeal: ({mealId}) =>
//         authenticateUser(req)
//             .then(user => deleteMeal({mealId, userId: user.id}))
// })

// function authenticateUser(req: http.IncomingMessage): Promise<User> {
//     const auth = req.headers.authorization
//     if (!auth || auth.indexOf('Basic ') !== 0) {
//         return Q.err(400, 'Wrong authentication format. Basic Authentication expected.')
//     }
//     const idAndPwd = b64.decode(auth.split(' ')[1])
//     const [idStr, pwd] = idAndPwd.split(':')
//     const id = parseInt(idStr)
//     if (isNaN(id) || !pwd) {
//         return Q.err(400, 'Malformed Basic Authentication content found.')
//     }
//     return selectMany(dbs.users, `
//         select u.id, u.name, u.email, u.pwd, u.age, u.gender, u.pregnancy, u.lactation,
//             u.activity_lvl, u.weight, u.height
//         from users u
//         where u.id = $1
//     `, [id]).then(data => {
//         if (data.length === 0) {
//             return Q.err(404, `No user found with id "${id}".`)
//         }
//         const user = data[0] as User & {pwd: dbs.users['pwd']}
//         return bcrypt.compare(pwd, user.pwd).then(same => {
//             if (!same) {
//                 return Q.err(401, 'Wrong credentials.')
//             }
//             return Q.ok(getPublishableUser(user))
//         })
//     })
// }

// function getPublishableUser(user: dbs.users): User {
//     delete user.pwd
//     return user
// }

// End-point handlers.

// const getFoodById: ServerApi['getFoodById'] = (id) => {
//     return selectMany<dbs.food_des & dbs.nut_data & dbs.nutr_def & dbs.fd_group>(void 0, `
//         select fd.long_desc, fg.fdgrp_desc, fg.color, nd.nutr_val, ndf.nutrdesc, ndf.display_name
//         from food_des fd
//         join nut_data nd using (ndb_no)
//         join nutr_def ndf using (nutr_no)
//         join fd_group fg using (fdgrp_cd)
//         where fd.ndb_no = $1
//         order by ndf.nutrdesc
//     `, [id]).then(data => {
//         if (data.length === 0) {
//             return Q.err(404)
//         } else {
//             return Q.ok({
//                 long_desc: data[0].long_desc,
//                 fdgrp_desc: data[0].fdgrp_desc,
//                 color: data[0].color,
//                 nutrients: data.map(d => ({
//                     nutr_val: d.nutr_val,
//                     nutrdesc: d.nutrdesc,
//                     display_name: d.display_name
//                 }))
//             })
//         }
//     })
// }

// const getRdis: ServerApi['getRdis'] = ({age, gender}) => {
//     const tuilQuery = selectMany(dbs.tuil, `
//         select tuil.nutr_no, tuil.value
//         from tuil
//         where tuil.age_min <= $1
//         and tuil.age_max >= $2
//         and tuil.gender = $3
//         and tuil.pregnancy = 'N'
//         and tuil.lactation = 'N'
//     `, [age, age, gender])
//
//     const rdiQuery = selectMany<dbs.rdi & dbs.nutr_def>(void 0, `
//         select rdi.value, ndf.nutrdesc, ndf.units, ndf.nutr_no
//         from rdi
//         join nutr_def ndf using (nutr_no)
//         where ndf.interest >= 10
//         and rdi.age_min <= $1
//         and rdi.age_max >= $2
//         and rdi.gender = $3
//         and rdi.pregnancy = 'N'
//         and rdi.lactation = 'N'
//         order by ndf.nutrdesc
//     `, [age, age, gender])
//
//     return Q.all([tuilQuery, rdiQuery]).then(([tuils, rdis]) => {
//         if (rdis.length === 0) {
//             return Q.err(404, `No RDI information found for ${age}-years-old ${gender === 'M' ? 'males' : 'females'}.`)
//         }
//         rdis.forEach(rdi => {
//             const tuil = tuils.find(tuil => tuil.nutr_no === rdi.nutr_no)
//             if (tuil) {
//                 (rdi as any).max = tuil.value
//             }
//         })
//         return Q.ok(rdis)
//     })
// }

// const getFoods: ServerApi['getFoods'] = ({name, groupId}) => {
//     const params: string[] = ['%' + name + '%']
//     if (groupId) {
//         params.push(groupId)
//     }
//     return selectMany<dbs.food_des & dbs.fd_group>(void 0, `
//         select fd.ndb_no, fd.long_desc, fg.fdgrp_desc, fg.color
//         from food_des fd
//         join fd_group fg using (fdgrp_cd)
//         where fg.interest >= 10
//         and lower(fd.long_desc) like lower($1)
//         ${groupId ? 'and fg.fdgrp_cd = $2' : ''}
//         limit 100
//     `, params)
// }

// const getFoodGroups: ServerApi['getFoodGroups'] = () => {
//     return selectMany(dbs.fd_group, `
//         select fg.fdgrp_cd, fg.fdgrp_desc
//         from fd_group fg
//         where fg.interest >= 10
//         order by fg.fdgrp_desc
//     `)
// }

// const getNutrients: ServerApi['getNutrients'] = () => {
//     return selectMany(dbs.nutr_def, `
//         select ndf.nutr_no, ndf.nutrdesc, ndf.units, ndf.display_name
//         from nutr_def ndf
//         where ndf.interest >= 10
//         order by coalesce(ndf.display_name, ndf.nutrdesc)
//     `)
// }

// const getTopFoodsForNutrient: ServerApi['getTopFoodsForNutrient'] = ({nutrientId, unit}) => {
//     const orderBy = unit === 'gram'
//         ? `nd.nutr_val`
//         : `if(nd.nutr_no = '208', nd.nutr_val, (100 * nd.nutr_val) / (
//                select in_nd.nutr_val
//                from nut_data in_nd
//                where in_nd.nutr_no = '208'
//                and in_nd.ndb_no = nd.ndb_no
//            ))`
//     return selectMany<dbs.food_des & dbs.nut_data & dbs.fd_group & dbs.nutr_def>(void 0, `
//         select fd.ndb_no, fd.long_desc, ndf.Units, fg.FdGrp_Desc, fg.color, ${orderBy} Nutr_Val
//         from food_des fd
//         join nut_data nd using (ndb_no)
//         join fd_group fg using (FdGrp_Cd)
//         join nutr_def ndf using (nutr_no)
//         where ndf.nutr_no = $1
//         and fg.interest >= 10
//         and (nd.Add_Nutr_Mark is null or nd.Add_Nutr_Mark != 'Y')
//         order by ${orderBy} desc
//         limit 200
//     `, [nutrientId])
// }

// const registerUser: ServerApi['registerUser'] = user => {
//     return bcrypt.hash(user.pwd, 10)
//         .then(hash => insertOne(dbs.users, {...user, pwd: hash}))
//         .then(user => getPublishableUser(user))
// }

// const updateUser = (user: Partial<dbs.users> & {id: number}): Promise<User> => {
//     return updateOne(dbs.users, {
//         name: user.name,
//         age: user.age,
//         gender: user.gender,
//         pregnancy: user.pregnancy,
//         lactation: user.lactation,
//         activity_lvl: user.activity_lvl,
//         weight: user.weight,
//         height: user.height
//     }, {
//         id: user.id
//     })
//     .then(user => getPublishableUser(user))
// }

// const getWeekMeals = (date = new Date, userId: number): Promise<Meal[]> => {
//     return selectMany<dbs.meals & dbs.food_des & {date: string}>(void 0, `
//         select ml.id, ml.date, ml.type, ml.qty, ml.eaten, ml.dorder, fd.ndb_no, fd.long_desc
//         from meals ml
//         join food_des fd using (ndb_no)
//         where ml.user_id = $1
//         and extract(year from ml.date) = extract(year from to_date($2, 'YYYY-MM-DD'))
//         and extract(week from ml.date) = extract(week from to_date($2, 'YYYY-MM-DD'))
//         order by ml.date, ml.dorder
//     `, [userId, date])
// }

// const getDayMeals = (date: Date, userId: number): Promise<Meal[]> => {
//     return selectMany<dbs.meals & dbs.food_des & {date: string}>(void 0, `
//         select ml.id, ml.date, ml.type, ml.qty, ml.eaten, ml.dorder, fd.ndb_no, fd.long_desc
//         from meals ml
//         join food_des fd using (ndb_no)
//         where ml.user_id = $1
//         and ml.date = to_date($2, 'YYYY-MM-DD')
//         order by ml.dorder asc
//     `, [userId, date])
// }

// const addMeal = (meal: NewMeal, userId: number) => {
//     return validDate(meal.date).then(date =>
//         getDayMeals(date, userId)
//             .then(meals => Math.max(...meals.map(m => m.dorder).concat(-1)))
//             .then(maxOrder => insertOne(dbs.meals, {
//                 ...meal,
//                 date,
//                 user_id: userId,
//                 dorder: maxOrder + 1
//             }))
//     )
// }

// const updateMeal = (meal: NewMeal & {id: number}, userId: number): Promise<dbs.meals> => {
//     return updateOne(dbs.meals, {
//         type: meal.type,
//         qty: meal.qty,
//         eaten: meal.eaten,
//         ndb_no: meal.ndb_no
//     }, {
//         id: meal.id,
//         user_id: userId
//     })
// }

// function updateMealPosition(_newMeal: Omit<MealPosition, 'date'> & {date: Date}, _userId: number): Promise<void> {
//     return Q.nil()
//     // const sameDayMeals = (date: Date) => selectMany<meals>(`select * from meals where date = $1 and user_id = $2`, [date, userId])
//
//     // selectOne(`select * from meals where id = $1 and user_id = $2`, [newMeal.id, userId])
//     //     .then(oldMeal => {
//     //         const dateChanged = oldMeal.date.getTime() !== newMeal.date.getTime()
//     //         const dorderChanged = oldMeal.dorder !== newMeal.dorder
//     //         if (!dateChanged && !dorderChanged) {
//     //             return Q.err(400, 'No changes detected.')
//     //         }
//     //         if (dateChanged) {
//     //             // TODO Fill in the gaps!
//     //             return deleteOne<meals>('meals', {id: oldMeal.id})
//     //         } else {
//     //             deleteMany<meals>('meals', {date: oldMeal.date, user_id: userId})
//     //                 .then(sameDayMeals => {
//     //                     sameDayMeals
//     //                         .sort((a, b) => a.dorder - b.dorder)
//     //                         .map((meal, idx) => ({...meal, dorder: idx}))
//     //                 })
//     //         }
//     //     })
//     //     .then(() => {
//
//     //     })
//
//     // selectOne(`select * from meals where id = $1 and user_id = $2`, [newMeal.id, userId]).then(oldMeal => {
//     //     const dateChanged = oldMeal.date.getTime() !== newMeal.date.getTime()
//     //     const dorderChanged = oldMeal.dorder !== newMeal.dorder
//     //     if (!dateChanged && !dorderChanged) {
//     //         return
//     //     }
//     //     const sameDayMealsSql = `select * from meals where date = $1 and user_id = $2`
//     //     return Q.all([
//     //         selectMany(sameDayMealsSql, [oldMeal.date, userId]),
//     //         selectMany(sameDayMealsSql, [newMeal.date, userId])
//     //     ]).then(([_oldMealsSameDay, _newMealsSameDay]) => {
//     //         // TODO
//     //     })
//     // })
// }

// const deleteMeal: ServerApi<'deleteMeal', {userId: number}> = ({mealId, userId}) => {
//     return deleteOne(dbs.meals, {
//         id: mealId,
//         user_id: userId
//     })
// }
