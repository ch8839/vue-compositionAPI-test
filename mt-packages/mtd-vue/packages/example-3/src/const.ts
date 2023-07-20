import navConfig from './nav.config.json'
import { getComponentNav } from './utils'

const navs = getComponentNav(navConfig).groups
navs.forEach((nav: any) => {
  nav.list = nav.list.sort((a: any, b: any) => {
    return a.name > b.name ? 1 : -1
  })
})

const components = navs
  .reduce((com: any, nav: any) => {
    com = com.concat(nav.list)
    return com
  }, [])
  .sort((a: any, b: any) => {
    return a.name > b.name ? 1 : -1
  })

export { navs, components }
