import * as db from './db/model'

export interface FoodDetails {
    Long_Desc: db.food_des['Long_Desc']
    nutrients: {
        Nutr_Val: db.nut_data['Nutr_Val']
        NutrDesc: db.nutr_def['NutrDesc']
    }[]
}

export interface FoundFood {
    NDB_No: db.food_des['NDB_No']
    Long_Desc: db.food_des['Long_Desc']
    FdGrp_Desc: db.fd_group['FdGrp_Desc']
}

export interface Rdi {
    NutrDesc: db.nutr_def['NutrDesc']
    Units: db.nutr_def['Units']
    value: db.rdi['value']
}
