import {Fn, Omit} from './Types'
import * as dbm from './db/model'

export type Api = {
    getFoodById: Fn<string, FoodDetails>
    getFoods: Fn<{name: string, groupId?: string}, FoundFood[]>
    getTopFoodsForNutrient: Fn<{nutrientId: string, unit?: NutrRefUnit}, TopFood[]>

    getRdis: Fn<{age: number, gender: dbm.GenderString}, Rdi[]>
    getFoodGroups: Fn<void, FoodGroup[]>
    getNutrients: Fn<void, Nutrient[]>

    registerUser: Fn<NewUser, User>
    getUser: Fn<Token, User>
    updateUser: Fn<Token & Omit<Partial<dbm.users>, 'id'>, User>

    getWeekMeals: Fn<Token & {date?: Date}, Meal[]>
    addMeal: Fn<Token & NewMeal, dbm.meals>
    updateMeal: Fn<Token & NewMeal & {id: number}, dbm.meals>
    updateMealPosition: Fn<Token & MealPosition, void>
    deleteMeal: Fn<Token & {mealId: number}, any>
}

export type Token = {$token: string}

export type NutrRefUnit = 'gram' | 'calory'

export type FoodDetails
    = Pick<dbm.food_des, 'long_desc'>
    & Pick<dbm.fd_group, 'fdgrp_desc' | 'color'>
    & {
        nutrients:
            ( Pick<dbm.nut_data, 'nutr_val'>
            & Pick<dbm.nutr_def, 'nutrdesc' | 'display_name'> )[]
    }

export type TopFood
    = Pick<dbm.food_des, 'ndb_no' | 'long_desc'>
    & Pick<dbm.nut_data, 'nutr_val'>
    & Pick<dbm.nutr_def, 'units'>
    & Pick<dbm.fd_group, 'fdgrp_desc' | 'color'>

export type Rdi
    = Pick<dbm.nutr_def, 'nutr_no' | 'nutrdesc' | 'units'>
    & Pick<dbm.rdi, 'value'>
    & {
        max?: dbm.tuil['value']
    }

export type FoundFood
    = Pick<dbm.food_des, 'ndb_no' | 'long_desc'>
    & Pick<dbm.fd_group, 'fdgrp_desc' | 'color'>

export type FoodGroup = Pick<dbm.fd_group, 'fdgrp_cd' | 'fdgrp_desc'>

export type Nutrient = Pick<dbm.nutr_def, 'nutr_no' | 'nutrdesc' | 'display_name' | 'units'>

export type User = Omit<dbm.users, 'pwd'>

export type NewUser
    = Omit<Partial<dbm.users>, 'id'>
    & Required<Pick<dbm.users, 'name' | 'email' | 'pwd'>>

export type Meal
    = Pick<dbm.meals, 'id' | 'date' | 'type' | 'qty' | 'eaten' | 'dorder'>
    & Pick<dbm.food_des, 'ndb_no' | 'long_desc'>

export type NewMeal
    = Pick<dbm.meals, 'date' | 'type' | 'qty' | 'eaten'>
    & Pick<dbm.food_des, 'ndb_no'>

export type MealPosition = Pick<dbm.meals, 'id' | 'date' | 'dorder'>
