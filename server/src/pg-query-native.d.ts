declare module 'pg-query-native' {
  export function parse(
    query: string
  ): {
    query: any[]
    error: {
      message: string
      fileName: string
      lineNumber: number
      cursorPosition: number
    }
  }
}
