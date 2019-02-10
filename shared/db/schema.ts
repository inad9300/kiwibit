export type BoolNumber = 1 | 0
export type BoolString = 'Y' | 'N'
export type GenderString = 'M' | 'F'

export class src_cd {
    src_cd!: string
    srccd_desc!: string
}

export class deriv_cd {
    deriv_cd!: string
    deriv_desc!: string
}

export class data_src {
    datasrc_id!: string
    authors?: string
    title!: string
    year?: string
    journal?: string
    vol_city?: string
    issue_state?: string
    start_page?: string
    end_page?: string
}

export class footnote {
    ndb_no!: string
    footnt_no!: string
    footnt_typ!: string
    nutr_no?: string
    footnt_txt!: string
}

export class langdesc {
    factor_code!: string
    description!: string
}

export class nutr_def {
    nutr_no!: string
    units!: string
    tagname?: string
    nutrdesc!: string
    display_name?: string
    num_dec!: number
    sr_order!: number
    interest!: number
    is_essential!: BoolString
}

export class fd_group {
    fdgrp_cd!: string
    fdgrp_desc!: string
    interest!: number
    color!: string
}

export class food_des {
    ndb_no!: string
    fdgrp_cd!: string
    long_desc!: string
    shrt_desc!: string
    comname?: string
    manufacname?: string
    survey?: string
    ref_desc?: string
    refuse?: number
    sciname?: string
    n_factor?: number
    pro_factor?: number
    fat_factor?: number
    cho_factor?: number
}

export class nut_data {
    ndb_no!: string
    nutr_no!: string
    nutr_val!: number
    num_data_pts!: number
    std_error?: number
    src_cd!: string
    deriv_cd?: string
    ref_ndb_no?: string
    add_nutr_mark?: string
    num_studies?: number
    min?: number
    max?: number
    df?: number
    low_eb?: number
    up_eb?: number
    stat_cmt?: string
    addmod_date?: string
    // cc?: string
}

export class weight {
    ndb_no!: string
    seq!: string
    amount!: number
    msre_desc!: string
    gm_wgt!: number
    num_data_pts?: number
    std_dev?: number
}

export class langual {
    ndb_no!: string
    factor_code!: string
}

export class datsrcln {
    ndb_no!: string
    nutr_no!: string
    datasrc_id!: string
}

export class rdi {
    id!: number
    nutr_no!: string
    age_min!: number
    age_max!: number
    gender!: GenderString
    pregnancy!: BoolString
    lactation!: BoolString
    type!: 'RDA' | 'AI' | 'UL' | 'AMDR'
    value!: number
}

export class tuil {
    id!: number
    nutr_no!: string
    age_min!: number
    age_max!: number
    gender!: GenderString
    pregnancy!: BoolString
    lactation!: BoolString
    value!: number
}

export class users {
    id!: number
    name!: string
    email!: string
    pwd!: string
    age?: number
    gender?: GenderString
    pregnancy!: BoolString
    lactation!: BoolString
    activity_lvl!: number
    weight?: number
    height?: number
}

export class meals {
    id!: number
    ndb_no!: string
    user_id!: number
    date!: Date
    type?: 'Breakfast' | 'Brunch' | 'Lunch' | 'Dinner' | 'Snack'
    qty!: number
    eaten!: BoolNumber
    dorder!: number
}
