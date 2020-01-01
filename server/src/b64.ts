export const b64 = {
  encode: (str: string): string => Buffer.from(str, 'utf8').toString('base64'),
  decode: (str: string): string => Buffer.from(str, 'base64').toString('utf8')
}
