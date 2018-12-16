import {Col} from '../../server/src/sql'

export type BoolNumber = 1 | 0
export type BoolString = 'Y' | 'N'
export type GenderString = 'M' | 'F'

export class src_cd {
    @Col src_cd!: string
    @Col srccd_desc!: string
}

export class deriv_cd {
    @Col deriv_cd!: string
    @Col deriv_desc!: string
}

export class data_src {
    @Col datasrc_id!: string
    @Col authors?: string
    @Col title!: string
    @Col year?: string
    @Col journal?: string
    @Col vol_city?: string
    @Col issue_state?: string
    @Col start_page?: string
    @Col end_page?: string
}

export class footnote {
    @Col ndb_no!: string
    @Col footnt_no!: string
    @Col footnt_typ!: string
    @Col nutr_no?: string
    @Col footnt_txt!: string
}

export class langdesc {
    @Col factor_code!: string
    @Col description!: string
}

export class nutr_def {
    @Col nutr_no!: string
    @Col units!: string
    @Col tagname?: string
    @Col nutrdesc!: string
    @Col display_name?: string
    @Col num_dec!: number
    @Col sr_order!: number
    @Col interest!: number
    @Col is_essential!: BoolString
}

export class fd_group {
    @Col fdgrp_cd!: string
    @Col fdgrp_desc!: string
    @Col interest!: number
    @Col color!: string
}

export class food_des {
    @Col ndb_no!: string
    @Col fdgrp_cd!: string
    @Col long_desc!: string
    @Col shrt_desc!: string
    @Col comname?: string
    @Col manufacname?: string
    @Col survey?: string
    @Col ref_desc?: string
    @Col refuse?: number
    @Col sciname?: string
    @Col n_factor?: number
    @Col pro_factor?: number
    @Col fat_factor?: number
    @Col cho_factor?: number
}

export class nut_data {
    @Col ndb_no!: string
    @Col nutr_no!: string
    @Col nutr_val!: number
    @Col num_data_pts!: number
    @Col std_error?: number
    @Col src_cd!: string
    @Col deriv_cd?: string
    @Col ref_ndb_no?: string
    @Col add_nutr_mark?: string
    @Col num_studies?: number
    @Col min?: number
    @Col max?: number
    @Col df?: number
    @Col low_eb?: number
    @Col up_eb?: number
    @Col stat_cmt?: string
    @Col addmod_date?: string
    // @Col cc?: string
}

export class weight {
    @Col ndb_no!: string
    @Col seq!: string
    @Col amount!: number
    @Col msre_desc!: string
    @Col gm_wgt!: number
    @Col num_data_pts?: number
    @Col std_dev?: number
}

export class langual {
    @Col ndb_no!: string
    @Col factor_code!: string
}

export class datsrcln {
    @Col ndb_no!: string
    @Col nutr_no!: string
    @Col datasrc_id!: string
}

export class rdi {
    @Col id!: number
    @Col nutr_no!: string
    @Col age_min!: number
    @Col age_max!: number
    @Col gender!: GenderString
    @Col pregnancy!: BoolString
    @Col lactation!: BoolString
    @Col type!: 'RDA' | 'AI' | 'UL' | 'AMDR'
    @Col value!: number
}

export class tuil {
    @Col id!: number
    @Col nutr_no!: string
    @Col age_min!: number
    @Col age_max!: number
    @Col gender!: GenderString
    @Col pregnancy!: BoolString
    @Col lactation!: BoolString
    @Col value!: number
}

export class users {
    @Col id!: number
    @Col name!: string
    @Col email!: string
    @Col pwd!: string
    @Col age?: number
    @Col gender?: GenderString
    @Col pregnancy!: BoolString
    @Col lactation!: BoolString
    @Col activity_lvl!: number
    @Col weight?: number
    @Col height?: number
}

export class meals {
    @Col id!: number
    @Col ndb_no!: string
    @Col user_id!: number
    @Col date!: Date
    @Col type?: 'Breakfast' | 'Brunch' | 'Lunch' | 'Dinner' | 'Snack'
    @Col qty!: number
    @Col eaten!: BoolNumber
    @Col dorder!: number
}
