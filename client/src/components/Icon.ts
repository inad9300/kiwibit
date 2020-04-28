import { library, icon, findIconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faSeedling, faPlus, faBinoculars, faCalendarWeek, faUserCog, faQuestion } from '@fortawesome/free-solid-svg-icons'

library.add(faSeedling, faPlus, faBinoculars, faCalendarWeek, faUserCog, faQuestion)

export type IconName = 'seedling' | 'plus' | 'binoculars' | 'calendar-week' | 'user-cog' | 'question'

export function Icon(name: IconName) {
  return icon(findIconDefinition({ prefix: 'fas', iconName: name })).node[0] as SVGSVGElement
}
