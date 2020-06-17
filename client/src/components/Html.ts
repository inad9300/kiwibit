if (DEBUG && (Element.prototype as any).with) {
  throw new Error('Whoa! `Element.prototype.with` has already been defined by someone else!?')
}

/**
 * Extension to `HTMLElement` and `SVGElement` interfaces in the spirit of
 * Kotlin's scope functions. A JavaScript keyword (`with`) is purposefully
 * used to try to minimize collisions, as this is a risky operation! But:
 * TypeScript's type system is not rich enough as to support this pattern
 * through different means.
 */
Element.prototype.with = function (init: (it: any) => any) {
  const ext = init(this)
  return ext ? Object.assign(this, ext) : this
}

declare global {
  interface Element {
    with<X extends void | Record<string, any>>(init: (it: this) => X): void extends X ? this : this & X
  }
}

export function Html<T extends keyof HTMLElementTagNameMap>(tag: T): HTMLElementTagNameMap[T] {
  return document.createElement(tag)
}

export function Svg<T extends keyof SVGElementTagNameMap>(tag: T): SVGElementTagNameMap[T] {
  return document.createElementNS('http://www.w3.org/2000/svg', tag)
}
