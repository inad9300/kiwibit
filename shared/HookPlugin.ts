import { Compiler, compilation } from 'webpack'

export const HookPlugin = (evt: keyof compilation.CompilerHooks, cb: () => void) => ({
  apply(compiler: Compiler) {
    compiler.hooks[evt].tap(`HookPlugin:${evt}`, cb)
  }
})
