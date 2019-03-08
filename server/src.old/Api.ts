// export type Api = {
//     getFoodById: Fn<string, FoodDetails>
//     getFoods: Fn<{name: string, groupId?: string}, FoundFood[]>
//     getTopFoodsForNutrient: Fn<{nutrientId: string, unit?: NutrRefUnit}, TopFood[]>

//     getRdis: Fn<{age: number, gender: dbs.GenderString}, Rdi[]>
//     getFoodGroups: Fn<void, FoodGroup[]>
//     getNutrients: Fn<void, Nutrient[]>

//     registerUser: Fn<NewUser, User>
//     getUser: Fn<Token, User>
//     updateUser: Fn<Token & Omit<Partial<dbs.users>, 'id'>, User>

//     getWeekMeals: Fn<Token & {date?: Date}, Meal[]>
//     addMeal: Fn<Token & NewMeal, dbs.meals>
//     updateMeal: Fn<Token & NewMeal & {id: number}, dbs.meals>
//     updateMealPosition: Fn<Token & MealPosition, void>
//     deleteMeal: Fn<Token & {mealId: number}, any>
// }

// export type Token = {$token: string}

// export type NutrRefUnit = 'gram' | 'calory'

// export type FoodDetails
//     = Pick<dbs.food_des, 'long_desc'>
//     & Pick<dbs.fd_group, 'fdgrp_desc' | 'color'>
//     & {
//         nutrients:
//             ( Pick<dbs.nut_data, 'nutr_val'>
//             & Pick<dbs.nutr_def, 'nutrdesc' | 'display_name'> )[]
//     }

// export type TopFood
//     = Pick<dbs.food_des, 'ndb_no' | 'long_desc'>
//     & Pick<dbs.nut_data, 'nutr_val'>
//     & Pick<dbs.nutr_def, 'units'>
//     & Pick<dbs.fd_group, 'fdgrp_desc' | 'color'>

// export type Rdi
//     = Pick<dbs.nutr_def, 'nutr_no' | 'nutrdesc' | 'units'>
//     & Pick<dbs.rdi, 'value'>
//     & {
//         max?: dbs.tuil['value']
//     }

// export type FoundFood
//     = Pick<dbs.food_des, 'ndb_no' | 'long_desc'>
//     & Pick<dbs.fd_group, 'fdgrp_desc' | 'color'>

// export type FoodGroup = Pick<dbs.fd_group, 'fdgrp_cd' | 'fdgrp_desc'>

// export type Nutrient = Pick<dbs.nutr_def, 'nutr_no' | 'nutrdesc' | 'display_name' | 'units'>

// export type User = Omit<dbs.users, 'pwd'>

// export type NewUser
//     = Omit<Partial<dbs.users>, 'id'>
//     & Required<Pick<dbs.users, 'name' | 'email' | 'pwd'>>

// export type Meal
//     = Pick<dbs.meals, 'id' | 'date' | 'type' | 'qty' | 'eaten' | 'dorder'>
//     & Pick<dbs.food_des, 'ndb_no' | 'long_desc'>

// export type NewMeal
//     = Pick<dbs.meals, 'date' | 'type' | 'qty' | 'eaten'>
//     & Pick<dbs.food_des, 'ndb_no'>

// export type MealPosition = Pick<dbs.meals, 'id' | 'date' | 'dorder'>
