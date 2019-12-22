export type WrapperType<T> = T extends boolean
  ? Boolean
  : T extends number
  ? Number
  : T extends string
  ? String
  : T
