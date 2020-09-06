import { library, icon, findIconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faBinoculars } from '@fortawesome/free-solid-svg-icons/faBinoculars'
import { faBookOpen } from '@fortawesome/free-solid-svg-icons/faBookOpen'
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons/faCalendarAlt'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight'
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit'
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome'
import { faImages } from '@fortawesome/free-solid-svg-icons/faImages'
import { faMugHot } from '@fortawesome/free-solid-svg-icons/faMugHot'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { faQuestion } from '@fortawesome/free-solid-svg-icons/faQuestion'
import { faRulerCombined } from '@fortawesome/free-solid-svg-icons/faRulerCombined'
import { faSeedling } from '@fortawesome/free-solid-svg-icons/faSeedling'
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
import { faUserCog } from '@fortawesome/free-solid-svg-icons/faUserCog'

library.add(
  faBinoculars,
  faBookOpen,
  faCalendarAlt,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faEdit,
  faHome,
  faImages,
  faMugHot,
  faPlus,
  faQuestion,
  faRulerCombined,
  faSeedling,
  faTrash,
  faUserCog
)

export type IconName =
  'binoculars' |
  'book-open' |
  'calendar-alt' |
  'chevron-down' |
  'chevron-left' |
  'chevron-right' |
  'edit' |
  'home' |
  'images' |
  'mug-hot' |
  'plus' |
  'question' |
  'ruler-combined' |
  'seedling' |
  'trash' |
  'user-cog'

export function Icon(name: IconName) {
  return icon(findIconDefinition({ prefix: 'fas', iconName: name })).node[0] as SVGSVGElement
}
