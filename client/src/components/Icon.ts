import { library, icon, findIconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faBinoculars } from '@fortawesome/free-solid-svg-icons/faBinoculars'
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons/faCalendarAlt'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown'
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome'
import { faMugHot } from '@fortawesome/free-solid-svg-icons/faMugHot'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { faQuestion } from '@fortawesome/free-solid-svg-icons/faQuestion'
import { faRulerCombined } from '@fortawesome/free-solid-svg-icons/faRulerCombined'
import { faSeedling } from '@fortawesome/free-solid-svg-icons/faSeedling'
import { faUserCog } from '@fortawesome/free-solid-svg-icons/faUserCog'

library.add(
  faBinoculars,
  faCalendarAlt,
  faChevronDown,
  faHome,
  faMugHot,
  faPlus,
  faQuestion,
  faRulerCombined,
  faSeedling,
  faUserCog
)

export type IconName =
  'binoculars' |
  'calendar-alt' |
  'chevron-down' |
  'home' |
  'mug-hot' |
  'plus' |
  'question' |
  'ruler-combined' |
  'seedling' |
  'user-cog'

export function Icon(name: IconName) {
  return icon(findIconDefinition({ prefix: 'fas', iconName: name })).node[0] as SVGSVGElement
}
