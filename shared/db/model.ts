export type BoolNumber = 1 | 0
export type BoolString = 'Y' | 'N'
export type GenderString = 'M' | 'F'

export interface src_cd {
    src_cd: string
    srccd_desc: string
}

export interface deriv_cd {
    deriv_cd: string
    deriv_desc: string
}

export interface data_src {
    datasrc_id: string
    authors: string | undefined
    title: string
    year: string | undefined
    journal: string | undefined
    vol_city: string | undefined
    issue_state: string | undefined
    start_page: string | undefined
    end_page: string | undefined
}

export interface footnote {
    ndb_no: string
    footnt_no: string
    footnt_typ: string
    nutr_no: string | undefined
    footnt_txt: string
}

export interface langdesc {
    factor_code: string
    description: string
}

export interface nutr_def {
    nutr_no: string
    units: string
    tagname: string | undefined
    nutrdesc: string
    display_name: string | undefined
    num_dec: number
    sr_order: number
    interest: number
    is_essential: BoolString
}

export interface fd_group {
    fdgrp_cd: string
    fdgrp_desc: string
    interest: number
    color: string
}

export interface food_des {
    ndb_no: string
    fdgrp_cd: string
    long_desc: string
    shrt_desc: string
    comname: string | undefined
    manufacname: string | undefined
    survey: string | undefined
    ref_desc: string | undefined
    refuse: number | undefined
    sciname: string | undefined
    n_factor: number | undefined
    pro_factor: number | undefined
    fat_factor: number | undefined
    cho_factor: number | undefined
}

export interface nut_data {
    ndb_no: string
    nutr_no: string
    nutr_val: number
    num_data_pts: number
    std_error: number | undefined
    src_cd: string
    deriv_cd: string | undefined
    ref_ndb_no: string | undefined
    add_nutr_mark: string | undefined
    num_studies: number | undefined
    min: number | undefined
    max: number | undefined
    df: number | undefined
    low_eb: number | undefined
    up_eb: number | undefined
    stat_cmt: string | undefined
    addmod_date: string | undefined
    // cc: string | undefined
}

export interface weight {
    ndb_no: string
    seq: string
    amount: number
    msre_desc: string
    gm_wgt: number
    num_data_pts: number | undefined
    std_dev: number | undefined
}

export interface langual {
    ndb_no: string
    factor_code: string
}

export interface datsrcln {
    ndb_no: string
    nutr_no: string
    datasrc_id: string
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
    ndb_no: string
    user_id: number
    date: Date
    type: 'Breakfast' | 'Brunch' | 'Lunch' | 'Dinner' | 'Snack' | undefined
    qty: number
    eaten: BoolNumber
    dorder: number
}
