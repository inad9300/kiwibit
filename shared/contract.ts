import * as db from './db/model'

export interface FoodDetails {
    Long_Desc: db.food_des['Long_Desc']
    FdGrp_Desc: db.fd_group['FdGrp_Desc']
    color: db.fd_group['color']
    nutrients: {
        Nutr_Val: db.nut_data['Nutr_Val']
        NutrDesc: db.nutr_def['NutrDesc']
        display_name: db.nutr_def['display_name']
    }[]
}

export interface FoundFood {
    NDB_No: db.food_des['NDB_No']
    Long_Desc: db.food_des['Long_Desc']
    FdGrp_Desc: db.fd_group['FdGrp_Desc']
    color: db.fd_group['color']
}

export interface Rdi {
    NutrDesc: db.nutr_def['NutrDesc']
    Units: db.nutr_def['Units']
    value: db.rdi['value']
}

export interface FoodCategory {
    FdGrp_Cd: db.fd_group['FdGrp_Cd']
    FdGrp_Desc: db.fd_group['FdGrp_Desc']
}
