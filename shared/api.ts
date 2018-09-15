import * as dbm from './db/model'

export interface FoodDetails {
    Long_Desc: dbm.food_des['Long_Desc']
    FdGrp_Desc: dbm.fd_group['FdGrp_Desc']
    color: dbm.fd_group['color']
    nutrients: {
        Nutr_Val: dbm.nut_data['Nutr_Val']
        NutrDesc: dbm.nutr_def['NutrDesc']
        display_name: dbm.nutr_def['display_name']
    }[]
}

export interface FoundFood {
    NDB_No: dbm.food_des['NDB_No']
    Long_Desc: dbm.food_des['Long_Desc']
    FdGrp_Desc: dbm.fd_group['FdGrp_Desc']
    color: dbm.fd_group['color']
}

export interface Rdi {
    Nutr_No: dbm.nutr_def['Nutr_No']
    NutrDesc: dbm.nutr_def['NutrDesc']
    Units: dbm.nutr_def['Units']
    value: dbm.rdi['value']
    max?: dbm.tuil['value']
}

export interface FoodGroup {
    FdGrp_Cd: dbm.fd_group['FdGrp_Cd']
    FdGrp_Desc: dbm.fd_group['FdGrp_Desc']
}

export interface Nutrient {
    Nutr_No: dbm.nutr_def['Nutr_No']
    NutrDesc: dbm.nutr_def['NutrDesc']
    display_name: dbm.nutr_def['display_name']
    Units: dbm.nutr_def['Units']
}

export interface TopFood {
    NDB_No: dbm.food_des['NDB_No']
    Long_Desc: dbm.food_des['Long_Desc']
    Nutr_Val: dbm.nut_data['Nutr_Val']
    Units: dbm.nutr_def['Units']
    FdGrp_Desc: dbm.fd_group['FdGrp_Desc']
    color: dbm.fd_group['color']
}

export interface User {
    id: dbm.users['id']
    name: dbm.users['name']
    email: dbm.users['email']
    age: dbm.users['age']
    gender: dbm.users['gender']
    pregnancy: dbm.users['pregnancy']
    lactation: dbm.users['lactation']
    activity_lvl: dbm.users['activity_lvl']
    weight: dbm.users['weight']
    height: dbm.users['height']
}

export interface NewUser {
    name: dbm.users['name']
    email: dbm.users['email']
    pwd: dbm.users['pwd']
    age: dbm.users['age']
    gender: dbm.users['gender']
    pregnancy: dbm.users['pregnancy']
    lactation: dbm.users['lactation']
    activity_lvl: dbm.users['activity_lvl']
    weight: dbm.users['weight']
    height: dbm.users['height']
}

export interface Meal {
    id: dbm.meals['id']
    date: string
    type: dbm.meals['type']
    qty: dbm.meals['qty']
    eaten: dbm.meals['eaten']
    dorder: dbm.meals['dorder']
    NDB_No: dbm.food_des['NDB_No']
    Long_Desc: dbm.food_des['Long_Desc']
}

export interface NewMeal {
    date: string
    type: dbm.meals['type']
    qty: dbm.meals['qty']
    eaten: dbm.meals['eaten']
    NDB_No: dbm.food_des['NDB_No']
}

export interface MealPosition {
    id: dbm.meals['id']
    date: string
    dorder: dbm.meals['dorder']
}
