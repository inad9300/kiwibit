export function Abbr(text: string, title: string) {
  const root = document.createElement('abbr')
  root.textContent = text
  root.title = title
  return root
}
