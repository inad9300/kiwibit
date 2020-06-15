import { library, icon, findIconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faBinoculars } from '@fortawesome/free-solid-svg-icons/faBinoculars'
import { faCalendarWeek } from '@fortawesome/free-solid-svg-icons/faCalendarWeek'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { faQuestion } from '@fortawesome/free-solid-svg-icons/faQuestion'
import { faSeedling } from '@fortawesome/free-solid-svg-icons/faSeedling'
import { faUserCog } from '@fortawesome/free-solid-svg-icons/faUserCog'
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown'
import { faMugHot } from '@fortawesome/free-solid-svg-icons/faMugHot'
import { faRulerCombined } from '@fortawesome/free-solid-svg-icons/faRulerCombined'

library.add(
  faBinoculars,
  faCalendarWeek,
  faPlus,
  faQuestion,
  faSeedling,
  faUserCog,
  faHome,
  faChevronDown,
  faMugHot,
  faRulerCombined
)

export type IconName =
  'binoculars' |
  'calendar-week' |
  'plus' |
  'question' |
  'seedling' |
  'user-cog' |
  'home' |
  'chevron-down' |
  'mug-hot' |
  'ruler-combined'

export function Icon(name: IconName) {
  return icon(findIconDefinition({ prefix: 'fas', iconName: name })).node[0] as SVGSVGElement
}
