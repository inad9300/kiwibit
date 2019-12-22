interface Error {
  toJSON(): { error: string }
}

Error.prototype.toJSON = function() {
  return { error: this.message }
}
