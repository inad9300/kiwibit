abstract class Component<T extends keyof HTMLElementTagNameMap> {

  readonly root: HTMLElementTagNameMap[T]

  constructor(tag: T) {
    this.root = document.createElement(tag)
    this.root.dataset.component = this.constructor.name
  }

  protected get text() {
    return this.root.textContent!
  }

  protected set text(value: string) {
    this.root.textContent = value
  }

  protected get hidden() {
    return this.root.hidden
  }

  protected set hidden(value: boolean) {
    this.root.hidden = value
  }

  protected get style() /* : CSSStyleDeclaration */ {
    return this.root.style
  }

  protected set style(css: Partial<CSSStyleDeclaration>) {
    Object.assign(this.root.style, css)
  }

  protected get html() {
    return this.root.innerHTML
  }

  protected set html(value: string) {
    this.root.innerHTML = value
  }

  protected get tabIndex() {
    return this.root.tabIndex
  }

  protected set tabIndex(value: number) {
    this.root.tabIndex = value
  }

  protected set events(eventMap: { [eventType in keyof HTMLElementEventMap]?: (ev: HTMLElementEventMap[eventType]) => void }) {
    for (const eventType in eventMap) {
      this.root.addEventListener(eventType, eventMap[eventType])
    }
  }

  protected get children() {
    return Array.from(this.root.children) as HTMLElement[] as ReadonlyArray<HTMLElement>
  }

  protected append(...components: Component<keyof HTMLElementTagNameMap>[]) {
    for (const c of components) {
      this.root.appendChild(c.root)
    }
  }
}
