import { Html } from '../components/Html'
import { api, ApiOutput } from '../utils/api'
import { NutrientSelect } from '../top-foods/NutrientSelect'
import { Vbox } from '../components/Box'

export function IntakeReferencesPage() {
  const container = Html('div').with(it => {
    it.style.flex = '1'
  })

  return Vbox().with(it => {
    it.style.padding = '12px 16px 16px'
    it.append(
      NutrientSelect().with(it => {
        it.style.marginBottom = '12px'
        it.onchange = () => {
          api('getAllIntakeMetadataForNutrient', { nutrientId: it.getSelected()!.id }).then(data => {
            container.innerHTML = ''
            container.append(Table(data))
          })
        }
      }),
      container
    )
  })
}

function Table(data: ApiOutput<'getAllIntakeMetadataForNutrient'>) {
  return Html('table').with(it => {
    it.append(
      ...data.rdis.map(rdi => {
        return Html('tr').with(it => {
          it.style.backgroundColor = '#bdb'
          it.append(
            Html('td').with(it => { it.textContent = '' + rdi.gender }),
            Html('td').with(it => { it.textContent = rdi.age_min + '–' + rdi.age_max }),
            Html('td').with(it => { it.textContent = '' + rdi.value })
          )
        })
      }),
      ...data.uls.map(ul => {
        return Html('tr').with(it => {
          it.style.backgroundColor = '#dbb'
          it.append(
            Html('td').with(it => { it.textContent = '' + ul.gender }),
            Html('td').with(it => { it.textContent = ul.age_min + '–' + ul.age_max }),
            Html('td').with(it => { it.textContent = '' + ul.value })
          )
        })
      })
    )
  })
}
