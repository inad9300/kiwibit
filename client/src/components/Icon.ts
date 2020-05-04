import { library, icon, findIconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faBinoculars } from '@fortawesome/free-solid-svg-icons/faBinoculars'
import { faCalendarWeek } from '@fortawesome/free-solid-svg-icons/faCalendarWeek'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { faQuestion } from '@fortawesome/free-solid-svg-icons/faQuestion'
import { faSeedling } from '@fortawesome/free-solid-svg-icons/faSeedling'
import { faUserCog } from '@fortawesome/free-solid-svg-icons/faUserCog'
import { faHandSpock } from '@fortawesome/free-solid-svg-icons/faHandSpock'

library.add(
  faBinoculars,
  faCalendarWeek,
  faPlus,
  faQuestion,
  faSeedling,
  faUserCog,
  faHandSpock
)

export type IconName =
  'binoculars' |
  'calendar-week' |
  'plus' |
  'question' |
  'seedling' |
  'user-cog' |
  'hand-spock'

export function Icon(name: IconName) {
  return icon(findIconDefinition({ prefix: 'fas', iconName: name })).node[0] as SVGSVGElement
}
