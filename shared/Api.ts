import {Fn, In, Out, AsyncFn} from './Types'
import {meals, food_des, fd_group, nut_data, nutr_def, rdi, tuil, users, GenderString} from './db/model'

export interface Api {
    getFoodById: Fn<string, FoodDetails>
    getFoods: Fn<{name: string, groupId?: string}, FoundFood[]>
    getTopFoodsForNutrient: Fn<{nutrientId: string, unit?: NutrRefUnit}, TopFood[]>

    getRdis: Fn<{age: number, gender: GenderString}, Rdi[]>
    getFoodGroups: Fn<void, FoodGroup[]>
    getNutrients: Fn<void, Nutrient[]>

    getCurrentUser: Fn<void, User>
    registerUser: Fn<NewUser, User>
    updateUser: Fn<NewUser & {id: number}, User>

    getWeekMeals: Fn<{date?: string, userId: number}, Meal[]>
    addMeal: Fn<NewMeal, meals>
    updateMeal: Fn<NewMeal & {id: number}, meals>
    updateMealPosition: Fn<MealPosition, void>
    deleteMeal: Fn<{mealId: number, userId: number}, any>
}

export type AsyncApi = {
    [F in keyof Api]: AsyncFn<In<Api[F]>, Out<Api[F]>>
}

export interface FoodDetails {
    long_desc: food_des['long_desc']
    fdgrp_desc: fd_group['fdgrp_desc']
    color: fd_group['color']
    nutrients: {
        nutr_val: nut_data['nutr_val']
        nutrdesc: nutr_def['nutrdesc']
        display_name: nutr_def['display_name']
    }[]
}

export interface Rdi {
    nutr_no: nutr_def['nutr_no']
    nutrdesc: nutr_def['nutrdesc']
    units: nutr_def['units']
    value: rdi['value']
    max?: tuil['value']
}

export interface FoundFood {
    ndb_no: food_des['ndb_no']
    long_desc: food_des['long_desc']
    fdgrp_desc: fd_group['fdgrp_desc']
    color: fd_group['color']
}

export interface FoodGroup {
    fdgrp_cd: fd_group['fdgrp_cd']
    fdgrp_desc: fd_group['fdgrp_desc']
}

export interface Nutrient {
    nutr_no: nutr_def['nutr_no']
    nutrdesc: nutr_def['nutrdesc']
    display_name: nutr_def['display_name']
    units: nutr_def['units']
}

export interface TopFood {
    ndb_no: food_des['ndb_no']
    long_desc: food_des['long_desc']
    nutr_val: nut_data['nutr_val']
    units: nutr_def['units']
    fdgrp_desc: fd_group['fdgrp_desc']
    color: fd_group['color']
}

export interface User {
    id: users['id']
    name: users['name']
    email: users['email']
    age: users['age']
    gender: users['gender']
    pregnancy: users['pregnancy']
    lactation: users['lactation']
    activity_lvl: users['activity_lvl']
    weight: users['weight']
    height: users['height']
}

export interface NewUser {
    name: users['name']
    email: users['email']
    pwd: users['pwd']
    age: users['age']
    gender: users['gender']
    pregnancy: users['pregnancy']
    lactation: users['lactation']
    activity_lvl: users['activity_lvl']
    weight: users['weight']
    height: users['height']
}

export interface Meal {
    id: meals['id']
    date: string
    type: meals['type']
    qty: meals['qty']
    eaten: meals['eaten']
    dorder: meals['dorder']
    ndb_no: food_des['ndb_no']
    long_desc: food_des['long_desc']
}

export interface NewMeal {
    date: string
    type: meals['type']
    qty: meals['qty']
    eaten: meals['eaten']
    ndb_no: food_des['ndb_no']
}

export interface MealPosition {
    id: meals['id']
    date: string
    dorder: meals['dorder']
}

export type NutrRefUnit = 'gram' | 'calory'
