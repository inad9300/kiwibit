import {query} from '../query'
import * as schema from '../schema'

type Input = {
    token: string
}

type Output = {
    id: schema.users['id']
    name: schema.users['name']
    email: schema.users['email']
    age: schema.users['age']
    gender: schema.users['gender']
    is_pregnant: schema.users['is_pregnant']
    is_lactating: schema.users['is_lactating']
    activity_level: schema.users['activity_level']
    weight_kg: schema.users['weight_kg']
    height_cm: schema.users['height_cm']
}

export function getCurrentUser(_input: Input): Promise<Output> {
    return query(`select * from users`, [], schema.users).then(res => res.rows[0])
}
