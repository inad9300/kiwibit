import {Table} from './Table'

export type data_sources = {
    id: number | null
    url: string
    title: string
    short_title: string | null
}

export const data_sources: Table<data_sources> = {
    id: {type: Number, optional: true},
    url: {type: String, optional: false},
    title: {type: String, optional: false},
    short_title: {type: String, optional: true}
}

export type files = {
    id: number | null
    name: string
    type: string
    data: Uint8Array
}

export const files: Table<files> = {
    id: {type: Number, optional: true},
    name: {type: String, optional: false},
    type: {type: String, optional: false},
    data: {type: Uint8Array, optional: false}
}

export type food_label_definitions = {
    id: number | null
    name: string
}

export const food_label_definitions: Table<food_label_definitions> = {
    id: {type: Number, optional: true},
    name: {type: String, optional: false}
}

export type food_labels = {
    food_id: number
    label_id: number
}

export const food_labels: Table<food_labels> = {
    food_id: {type: Number, optional: false},
    label_id: {type: Number, optional: false}
}

export type food_nutrients = {
    food_id: number
    nutrient_id: number
    amount: number
}

export const food_nutrients: Table<food_nutrients> = {
    food_id: {type: Number, optional: false},
    nutrient_id: {type: Number, optional: false},
    amount: {type: Number, optional: false}
}

export type foods = {
    id: number | null
    source_id: number
    external_id: string
    is_public: boolean | null
    name: string
    usda_category_id: number
    nf_dd_category_id: number | null
    picture: Uint8Array | null
}

export const foods: Table<foods> = {
    id: {type: Number, optional: true},
    source_id: {type: Number, optional: false},
    external_id: {type: String, optional: false},
    is_public: {type: Boolean, optional: true},
    name: {type: String, optional: false},
    usda_category_id: {type: Number, optional: false},
    nf_dd_category_id: {type: Number, optional: true},
    picture: {type: Uint8Array, optional: true}
}

export type food_unit_ratios = {
    food_id: number
    unit: string
    grams: number
}

export const food_unit_ratios: Table<food_unit_ratios> = {
    food_id: {type: Number, optional: false},
    unit: {type: String, optional: false},
    grams: {type: Number, optional: false}
}

export type meal_types = {
    id: number | null
    name: string
}

export const meal_types: Table<meal_types> = {
    id: {type: Number, optional: true},
    name: {type: String, optional: false}
}

export type nf_dd_categories = {
    id: number | null
    name: string
    servings: number
}

export const nf_dd_categories: Table<nf_dd_categories> = {
    id: {type: Number, optional: true},
    name: {type: String, optional: false},
    servings: {type: Number, optional: false}
}

export type nutrient_categories = {
    id: number | null
    name: string
}

export const nutrient_categories: Table<nutrient_categories> = {
    id: {type: Number, optional: true},
    name: {type: String, optional: false}
}

export type nutrients = {
    id: number | null
    name: string
    abbr: string | null
    alias: string | null
    unit_id: number
    is_essential: boolean
    is_visible_default: boolean
    category_id: number
    source_id: number
    external_id: string
}

export const nutrients: Table<nutrients> = {
    id: {type: Number, optional: true},
    name: {type: String, optional: false},
    abbr: {type: String, optional: true},
    alias: {type: String, optional: true},
    unit_id: {type: Number, optional: false},
    is_essential: {type: Boolean, optional: false},
    is_visible_default: {type: Boolean, optional: false},
    category_id: {type: Number, optional: false},
    source_id: {type: Number, optional: false},
    external_id: {type: String, optional: false}
}

export type recipe_ingredients = {
    id: number | null
    recipe_id: number
    ingredient_food_id: number | null
    ingredient_recipe_id: number | null
    amount_g: number
}

export const recipe_ingredients: Table<recipe_ingredients> = {
    id: {type: Number, optional: true},
    recipe_id: {type: Number, optional: false},
    ingredient_food_id: {type: Number, optional: true},
    ingredient_recipe_id: {type: Number, optional: true},
    amount_g: {type: Number, optional: false}
}

export type recipes = {
    id: number | null
    source_id: number
    external_id: string
    is_public: boolean | null
    title: string
    description: string | null
    estimated_time_min: number | null
    estimated_difficulty: string | null
    picture: Uint8Array | null
}

export const recipes: Table<recipes> = {
    id: {type: Number, optional: true},
    source_id: {type: Number, optional: false},
    external_id: {type: String, optional: false},
    is_public: {type: Boolean, optional: true},
    title: {type: String, optional: false},
    description: {type: String, optional: true},
    estimated_time_min: {type: Number, optional: true},
    estimated_difficulty: {type: String, optional: true},
    picture: {type: Uint8Array, optional: true}
}

export type reference_intakes = {
    source_id: number
    nutrient_id: number
    age_min: number
    age_max: number
    gender: string
    for_pregnancy: boolean
    for_lactation: boolean
    value: number
}

export const reference_intakes: Table<reference_intakes> = {
    source_id: {type: Number, optional: false},
    nutrient_id: {type: Number, optional: false},
    age_min: {type: Number, optional: false},
    age_max: {type: Number, optional: false},
    gender: {type: String, optional: false},
    for_pregnancy: {type: Boolean, optional: false},
    for_lactation: {type: Boolean, optional: false},
    value: {type: Number, optional: false}
}

export type tolerable_intakes = {
    source_id: number
    nutrient_id: number
    age_min: number
    age_max: number
    gender: string
    for_pregnancy: boolean
    for_lactation: boolean
    value: number
}

export const tolerable_intakes: Table<tolerable_intakes> = {
    source_id: {type: Number, optional: false},
    nutrient_id: {type: Number, optional: false},
    age_min: {type: Number, optional: false},
    age_max: {type: Number, optional: false},
    gender: {type: String, optional: false},
    for_pregnancy: {type: Boolean, optional: false},
    for_lactation: {type: Boolean, optional: false},
    value: {type: Number, optional: false}
}

export type units = {
    id: number | null
    abbr: string
    name: string
}

export const units: Table<units> = {
    id: {type: Number, optional: true},
    abbr: {type: String, optional: false},
    name: {type: String, optional: false}
}

export type usda_categories = {
    id: number | null
    name: string
    is_visible_default: boolean
    color: string
    usda_id: string
}

export const usda_categories: Table<usda_categories> = {
    id: {type: Number, optional: true},
    name: {type: String, optional: false},
    is_visible_default: {type: Boolean, optional: false},
    color: {type: String, optional: false},
    usda_id: {type: String, optional: false}
}

export type user_daily_foods = {
    user_id: number
    food_id: number
    date: Date
    meal_type_id: number
    amount_g: number
}

export const user_daily_foods: Table<user_daily_foods> = {
    user_id: {type: Number, optional: false},
    food_id: {type: Number, optional: false},
    date: {type: Date, optional: false},
    meal_type_id: {type: Number, optional: false},
    amount_g: {type: Number, optional: false}
}

export type user_daily_recipes = {
    user_id: number
    recipe_id: number
    date: Date
    meal_type_id: number
    amount_g: number
}

export const user_daily_recipes: Table<user_daily_recipes> = {
    user_id: {type: Number, optional: false},
    recipe_id: {type: Number, optional: false},
    date: {type: Date, optional: false},
    meal_type_id: {type: Number, optional: false},
    amount_g: {type: Number, optional: false}
}

export type users = {
    id: number | null
    name: string
    email: string
    password: string
    age: number | null
    gender: string | null
    is_verified: boolean | null
    user_type_id: number
    is_pregnant: boolean | null
    is_lactating: boolean | null
    activity_level: number | null
    weight_kg: number | null
    height_cm: number | null
    picture: Uint8Array | null
}

export const users: Table<users> = {
    id: {type: Number, optional: true},
    name: {type: String, optional: false},
    email: {type: String, optional: false},
    password: {type: String, optional: false},
    age: {type: Number, optional: true},
    gender: {type: String, optional: true},
    is_verified: {type: Boolean, optional: true},
    user_type_id: {type: Number, optional: false},
    is_pregnant: {type: Boolean, optional: true},
    is_lactating: {type: Boolean, optional: true},
    activity_level: {type: Number, optional: true},
    weight_kg: {type: Number, optional: true},
    height_cm: {type: Number, optional: true},
    picture: {type: Uint8Array, optional: true}
}

export type user_types = {
    id: number | null
    name: string
}

export const user_types: Table<user_types> = {
    id: {type: Number, optional: true},
    name: {type: String, optional: false}
}

export type user_visible_nutrients = {
    user_id: number
    nutrient_id: number
    is_visible: boolean
}

export const user_visible_nutrients: Table<user_visible_nutrients> = {
    user_id: {type: Number, optional: false},
    nutrient_id: {type: Number, optional: false},
    is_visible: {type: Boolean, optional: false}
}

export type user_visible_usda_categories = {
    user_id: number
    usda_category_id: number
    is_visible: boolean
}

export const user_visible_usda_categories: Table<user_visible_usda_categories> = {
    user_id: {type: Number, optional: false},
    usda_category_id: {type: Number, optional: false},
    is_visible: {type: Boolean, optional: false}
}
