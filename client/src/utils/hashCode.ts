export function hashCode(obj: any): number {
  if (obj == null)
    return 0

  const str = JSON.stringify(obj)
  if (str.length === 0)
    return 0

  let hash = 0
  for (let i = 0; i < str.length; ++i)
    hash = (((hash << 5) - hash) + str.charCodeAt(i)) | 0

  return hash
}
