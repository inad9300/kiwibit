type NewUser = {
  name: string
}

export function registerUser(_user: NewUser) {
  return Promise.resolve({ name: 'Blues' })
}
