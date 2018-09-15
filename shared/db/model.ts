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
    Authors?: string
    Title: string
    Year?: string
    Journal?: string
    Vol_City?: string
    Issue_State?: string
    Start_Page?: string
    End_Page?: string
}

export interface footnote {
    NDB_No: string
    FootNt_No: string
    Footnt_Typ: string
    Nutr_No?: string
    Footnt_Txt: string
}

export interface langdesc {
    Factor_Code: string
    Description: string
}

export interface nutr_def {
    Nutr_No: string
    Units: string
    Tagname?: string
    NutrDesc: string
    display_name?: string
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
    ComName?: string
    ManufacName?: string
    Survey?: string
    Ref_desc?: string
    Refuse?: number
    SciName?: string
    N_Factor?: number
    Pro_Factor?: number
    Fat_Factor?: number
    CHO_Factor?: number
}

export interface nut_data {
    NDB_No: string
    Nutr_No: string
    Nutr_Val: number
    Num_Data_Pts: number
    Std_Error?: number
    Src_Cd: string
    Deriv_Cd?: string
    Ref_NDB_No?: string
    Add_Nutr_Mark?: string
    Num_Studies?: number
    Min?: number
    Max?: number
    DF?: number
    Low_EB?: number
    Up_EB?: number
    Stat_cmt?: string
    AddMod_Date?: string
    CC?: string
}

export interface weight {
    NDB_No: string
    Seq: string
    Amount: number
    Msre_Desc: string
    Gm_Wgt: number
    Num_Data_Pts?: number
    Std_Dev?: number
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
    age?: number
    gender?: GenderString
    pregnancy: BoolString
    lactation: BoolString
    activity_lvl: number
    weight?: number
    height?: number
}

export interface meals {
    id: number
    NDB_No: string
    user_id: number
    date: Date
    type?: 'Breakfast' | 'Brunch' | 'Lunch' | 'Dinner' | 'Snack'
    qty: number
    eaten: BoolNumber
    dorder: number
}
