import { Vbox } from './Box'
import { ControlTitle } from './ControlTitle'

export function FormControl(title: string, control: HTMLElement) {
  return Vbox().with(it =>
    it.append(ControlTitle(title), control)
  )
}
