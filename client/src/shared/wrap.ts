export function wrap<T extends keyof HTMLElementTagNameMap>(element: string | HTMLElement, tag: T) {
  const wrapper = document.createElement(tag)
  wrapper.append(element)
  return wrapper
}
