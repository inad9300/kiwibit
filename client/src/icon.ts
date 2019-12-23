import '@fortawesome/fontawesome-free/css/solid.css'
import '@fortawesome/fontawesome-free/css/fontawesome.css'

import { IconName } from '@fortawesome/fontawesome-common-types'

export function icon(name: IconName) {
  const root = document.createElement('i')
  root.className = 'fas fa-' + name

  return root
}
