import {RowMetadata} from './RowMetadata'

export type data_src = {
    datasrc_id: string
	authors: string | null
	title: string
	year: string | null
	journal: string | null
	vol_city: string | null
	issue_state: string | null
	start_page: string | null
	end_page: string | null
}

export const data_src: RowMetadata<data_src> = {
    datasrc_id: {type: String, optional: false},
	authors: {type: String, optional: true},
	title: {type: String, optional: false},
	year: {type: String, optional: true},
	journal: {type: String, optional: true},
	vol_city: {type: String, optional: true},
	issue_state: {type: String, optional: true},
	start_page: {type: String, optional: true},
	end_page: {type: String, optional: true}
}

export type datsrcln = {
    ndb_no: string
	nutr_no: string
	datasrc_id: string
}

export const datsrcln: RowMetadata<datsrcln> = {
    ndb_no: {type: String, optional: false},
	nutr_no: {type: String, optional: false},
	datasrc_id: {type: String, optional: false}
}

export type deriv_cd = {
    deriv_cd: string
	deriv_desc: string
}

export const deriv_cd: RowMetadata<deriv_cd> = {
    deriv_cd: {type: String, optional: false},
	deriv_desc: {type: String, optional: false}
}

export type fd_group = {
    fdgrp_cd: string
	fdgrp_desc: string
	interest: number
	color: string
}

export const fd_group: RowMetadata<fd_group> = {
    fdgrp_cd: {type: String, optional: false},
	fdgrp_desc: {type: String, optional: false},
	interest: {type: Number, optional: false},
	color: {type: String, optional: false}
}

export type food_des = {
    ndb_no: string
	fdgrp_cd: string
	long_desc: string
	shrt_desc: string
	comname: string | null
	manufacname: string | null
	survey: string | null
	ref_desc: string | null
	refuse: number | null
	sciname: string | null
	n_factor: number | null
	pro_factor: number | null
	fat_factor: number | null
	cho_factor: number | null
}

export const food_des: RowMetadata<food_des> = {
    ndb_no: {type: String, optional: false},
	fdgrp_cd: {type: String, optional: false},
	long_desc: {type: String, optional: false},
	shrt_desc: {type: String, optional: false},
	comname: {type: String, optional: true},
	manufacname: {type: String, optional: true},
	survey: {type: String, optional: true},
	ref_desc: {type: String, optional: true},
	refuse: {type: Number, optional: true},
	sciname: {type: String, optional: true},
	n_factor: {type: Number, optional: true},
	pro_factor: {type: Number, optional: true},
	fat_factor: {type: Number, optional: true},
	cho_factor: {type: Number, optional: true}
}

export type footnote = {
    ndb_no: string
	footnt_no: string
	footnt_typ: string
	nutr_no: string | null
	footnt_txt: string
}

export const footnote: RowMetadata<footnote> = {
    ndb_no: {type: String, optional: false},
	footnt_no: {type: String, optional: false},
	footnt_typ: {type: String, optional: false},
	nutr_no: {type: String, optional: true},
	footnt_txt: {type: String, optional: false}
}

export type langdesc = {
    factor_code: string
	description: string
}

export const langdesc: RowMetadata<langdesc> = {
    factor_code: {type: String, optional: false},
	description: {type: String, optional: false}
}

export type langual = {
    ndb_no: string
	factor_code: string
}

export const langual: RowMetadata<langual> = {
    ndb_no: {type: String, optional: false},
	factor_code: {type: String, optional: false}
}

export type meals = {
    id: number
	ndb_no: string
	user_id: number
	date: Date
	type: string | null
	qty: number
	eaten: boolean
	dorder: number
	settled: boolean | null
}

export const meals: RowMetadata<meals> = {
    id: {type: Number, optional: false},
	ndb_no: {type: String, optional: false},
	user_id: {type: Number, optional: false},
	date: {type: Date, optional: false},
	type: {type: String, optional: true},
	qty: {type: Number, optional: false},
	eaten: {type: Boolean, optional: false},
	dorder: {type: Number, optional: false},
	settled: {type: Boolean, optional: true}
}

export type nut_data = {
    ndb_no: string
	nutr_no: string
	nutr_val: number
	num_data_pts: number
	std_error: number | null
	src_cd: string
	deriv_cd: string | null
	ref_ndb_no: string | null
	add_nutr_mark: string | null
	num_studies: number | null
	min: number | null
	max: number | null
	df: number | null
	low_eb: number | null
	up_eb: number | null
	stat_cmt: string | null
	addmod_date: string | null
}

export const nut_data: RowMetadata<nut_data> = {
    ndb_no: {type: String, optional: false},
	nutr_no: {type: String, optional: false},
	nutr_val: {type: Number, optional: false},
	num_data_pts: {type: Number, optional: false},
	std_error: {type: Number, optional: true},
	src_cd: {type: String, optional: false},
	deriv_cd: {type: String, optional: true},
	ref_ndb_no: {type: String, optional: true},
	add_nutr_mark: {type: String, optional: true},
	num_studies: {type: Number, optional: true},
	min: {type: Number, optional: true},
	max: {type: Number, optional: true},
	df: {type: Number, optional: true},
	low_eb: {type: Number, optional: true},
	up_eb: {type: Number, optional: true},
	stat_cmt: {type: String, optional: true},
	addmod_date: {type: String, optional: true}
}

export type nutr_def = {
    nutr_no: string
	units: string
	tagname: string | null
	nutrdesc: string
	num_dec: number
	sr_order: number
	interest: number
	is_essential: string
	display_name: string | null
}

export const nutr_def: RowMetadata<nutr_def> = {
    nutr_no: {type: String, optional: false},
	units: {type: String, optional: false},
	tagname: {type: String, optional: true},
	nutrdesc: {type: String, optional: false},
	num_dec: {type: Number, optional: false},
	sr_order: {type: Number, optional: false},
	interest: {type: Number, optional: false},
	is_essential: {type: String, optional: false},
	display_name: {type: String, optional: true}
}

export type rdi = {
    id: number
	nutr_no: string
	age_min: number
	age_max: number
	gender: string
	pregnancy: string
	lactation: string
	type: string
	value: number
}

export const rdi: RowMetadata<rdi> = {
    id: {type: Number, optional: false},
	nutr_no: {type: String, optional: false},
	age_min: {type: Number, optional: false},
	age_max: {type: Number, optional: false},
	gender: {type: String, optional: false},
	pregnancy: {type: String, optional: false},
	lactation: {type: String, optional: false},
	type: {type: String, optional: false},
	value: {type: Number, optional: false}
}

export type src_cd = {
    src_cd: string
	srccd_desc: string
}

export const src_cd: RowMetadata<src_cd> = {
    src_cd: {type: String, optional: false},
	srccd_desc: {type: String, optional: false}
}

export type tuil = {
    id: number
	nutr_no: string
	age_min: number
	age_max: number
	gender: string
	pregnancy: string
	lactation: string
	value: number
}

export const tuil: RowMetadata<tuil> = {
    id: {type: Number, optional: false},
	nutr_no: {type: String, optional: false},
	age_min: {type: Number, optional: false},
	age_max: {type: Number, optional: false},
	gender: {type: String, optional: false},
	pregnancy: {type: String, optional: false},
	lactation: {type: String, optional: false},
	value: {type: Number, optional: false}
}

export type users = {
    id: number
	name: string
	email: string
	pwd: string
	age: number | null
	gender: string | null
	pregnancy: string | null
	lactation: string | null
	activity_lvl: number | null
	weight: number | null
	height: number | null
}

export const users: RowMetadata<users> = {
    id: {type: Number, optional: false},
	name: {type: String, optional: false},
	email: {type: String, optional: false},
	pwd: {type: String, optional: false},
	age: {type: Number, optional: true},
	gender: {type: String, optional: true},
	pregnancy: {type: String, optional: true},
	lactation: {type: String, optional: true},
	activity_lvl: {type: Number, optional: true},
	weight: {type: Number, optional: true},
	height: {type: Number, optional: true}
}

export type weight = {
    ndb_no: string
	seq: string
	amount: number
	msre_desc: string
	gm_wgt: number
	num_data_pts: number | null
	std_dev: number | null
}

export const weight: RowMetadata<weight> = {
    ndb_no: {type: String, optional: false},
	seq: {type: String, optional: false},
	amount: {type: Number, optional: false},
	msre_desc: {type: String, optional: false},
	gm_wgt: {type: Number, optional: false},
	num_data_pts: {type: Number, optional: true},
	std_dev: {type: Number, optional: true}
}
