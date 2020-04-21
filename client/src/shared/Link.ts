export function Link(url: string) {
    const root = document.createElement('a')
    root.style.outline = '0'
    root.href = url

    return root
  }
