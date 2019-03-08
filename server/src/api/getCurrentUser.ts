import {ApiFn} from '../Api'
import {sql} from '../sql'
import * as schema from '../schema'

type Input = {
    token: string
}

type Output = {
    id: schema.users['id']
	name: schema.users['name']
	email: schema.users['email']
	pwd: schema.users['pwd']
	age: schema.users['age']
	gender: schema.users['gender']
	pregnancy: schema.users['pregnancy']
	lactation: schema.users['lactation']
	activity_lvl: schema.users['activity_lvl']
	weight: schema.users['weight']
	height: schema.users['height']
}

export const getCurrentUser: ApiFn<Input, Output> = () => {
    return sql(`select * from users`, [], schema.users).then(res => res.rows[0])
}
