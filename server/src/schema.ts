export type data_sources = {
  id: number
  url: string
  title: string
  short_title: string | null
}

export type files = {
  id: number
  name: string
  type: string
  data: Uint8Array
}

export type food_label_definitions = {
  id: number
  name: string
}

export type food_labels = {
  food_id: number
  label_id: number
}

export type food_nutrients = {
  food_id: number
  nutrient_id: number
  amount: number
}

export type food_unit_ratios = {
  food_id: number
  unit: string
  grams: number
}

export type foods = {
  id: number
  source_id: number
  external_id: string
  is_public: boolean | null
  name: string
  usda_category_id: number
  nf_dd_category_id: number | null
  picture: Uint8Array | null
}

export type meal_types = {
  id: number
  name: string
}

export type nf_dd_categories = {
  id: number
  name: string
  servings: number
}

export type nutrient_categories = {
  id: number
  name: string
}

export type nutrients = {
  id: number
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

export type recipe_ingredients = {
  id: number
  recipe_id: number
  ingredient_food_id: number | null
  ingredient_recipe_id: number | null
  amount_g: number
}

export type recipes = {
  id: number
  source_id: number
  external_id: string
  is_public: boolean | null
  title: string
  description: string | null
  estimated_time_min: number | null
  estimated_difficulty: string | null
  picture: Uint8Array | null
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

export type units = {
  id: number
  abbr: string
  name: string
}

export type usda_categories = {
  id: number
  name: string
  is_visible_default: boolean
  color: string
  usda_id: string
}

export type user_daily_foods = {
  user_id: number
  food_id: number
  date: Date
  meal_type_id: number
  amount_g: number
}

export type user_daily_recipes = {
  user_id: number
  recipe_id: number
  date: Date
  meal_type_id: number
  amount_g: number
}

export type user_types = {
  id: number
  name: string
}

export type user_visible_nutrients = {
  user_id: number
  nutrient_id: number
  is_visible: boolean
}

export type user_visible_usda_categories = {
  user_id: number
  usda_category_id: number
  is_visible: boolean
}

export type users = {
  id: number
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
