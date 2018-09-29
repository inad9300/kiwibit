export type BoolString = 'Y' | 'N'

export type BoolNumber = 1 | 0

export type GenderString = 'M' | 'F'

export interface src_cd {
    Src_Cd: string
    SrcCd_Desc: string
}

export interface deriv_cd {
    Deriv_Cd: string
    Deriv_Desc: string
}

export interface data_src {
    DataSrc_ID: string
    Authors: string | undefined
    Title: string
    Year: string | undefined
    Journal: string | undefined
    Vol_City: string | undefined
    Issue_State: string | undefined
    Start_Page: string | undefined
    End_Page: string | undefined
}

export interface footnote {
    NDB_No: string
    FootNt_No: string
    Footnt_Typ: string
    Nutr_No: string | undefined
    Footnt_Txt: string
}

export interface langdesc {
    Factor_Code: string
    Description: string
}

export interface nutr_def {
    Nutr_No: string
    Units: string
    Tagname: string | undefined
    NutrDesc: string
    display_name: string | undefined
    Num_Dec: number
    SR_Order: number
    interest: number
    is_essential: BoolString
}

export interface fd_group {
    FdGrp_Cd: string
    FdGrp_Desc: string
    interest: number
    color: string
}

export interface food_des {
    NDB_No: string
    FdGrp_Cd: string
    Long_Desc: string
    Shrt_Desc: string
    ComName: string | undefined
    ManufacName: string | undefined
    Survey: string | undefined
    Ref_desc: string | undefined
    Refuse: number | undefined
    SciName: string | undefined
    N_Factor: number | undefined
    Pro_Factor: number | undefined
    Fat_Factor: number | undefined
    CHO_Factor: number | undefined
}

export interface nut_data {
    NDB_No: string
    Nutr_No: string
    Nutr_Val: number
    Num_Data_Pts: number
    Std_Error: number | undefined
    Src_Cd: string
    Deriv_Cd: string | undefined
    Ref_NDB_No: string | undefined
    Add_Nutr_Mark: string | undefined
    Num_Studies: number | undefined
    Min: number | undefined
    Max: number | undefined
    DF: number | undefined
    Low_EB: number | undefined
    Up_EB: number | undefined
    Stat_cmt: string | undefined
    AddMod_Date: string | undefined
    // CC: string | undefined
}

export interface weight {
    NDB_No: string
    Seq: string
    Amount: number
    Msre_Desc: string
    Gm_Wgt: number
    Num_Data_Pts: number | undefined
    Std_Dev: number | undefined
}

export interface langual {
    NDB_No: string
    Factor_Code: string
}

export interface datsrcln {
    NDB_No: string
    Nutr_No: string
    DataSrc_ID: string
}

export interface rdi {
    id: number
    nutr_no: string
    age_min: number
    age_max: number
    gender: GenderString
    pregnancy: BoolString
    lactation: BoolString
    type: 'RDA' | 'AI' | 'UL' | 'AMDR'
    value: number
}

export interface tuil {
    id: number
    nutr_no: string
    age_min: number
    age_max: number
    gender: GenderString
    pregnancy: BoolString
    lactation: BoolString
    value: number
}

export interface users {
    id: number
    name: string
    email: string
    pwd: string
    age: number | undefined
    gender: GenderString | undefined
    pregnancy: BoolString
    lactation: BoolString
    activity_lvl: number
    weight: number | undefined
    height: number | undefined
}

export interface meals {
    id: number
    NDB_No: string
    user_id: number
    date: Date
    type: 'Breakfast' | 'Brunch' | 'Lunch' | 'Dinner' | 'Snack' | undefined
    qty: number
    eaten: BoolNumber
    dorder: number
}
