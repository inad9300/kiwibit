export type NonNull<T> = {
  [P in keyof T]: NonNullable<T[P]>
}
