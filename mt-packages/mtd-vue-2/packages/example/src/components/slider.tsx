import {
  ref,
  computed,
  defineComponent,
  inject,
} from '@vue/composition-api'
import navConfig from '../nav.config.json'

function getComponentNav(navs: any) {
  return navs.find((nav: any) => nav.path === '/components')
}

export default defineComponent({
  name: 'MtdSlider',
  inheritAttrs: false,
  setup() {
    const app = inject('app')
    const navs = getComponentNav(navConfig).groups
    const clicked = ref<number>(0)
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
    const hideSidebar = computed(() => (app as any).hideSidebar)
    const isExpandWhenNarrowScreen = false

    return {
      hideSidebar,
      navs,
      components,
      isExpandWhenNarrowScreen,
      clicked,
    }
  },
  render() {
    const { hideSidebar, navs, isExpandWhenNarrowScreen } = this
    return (
      !hideSidebar ? <div
        class={["aside", {
          'narrow-screen-expanded': isExpandWhenNarrowScreen,
        }]}>
        <div class="sidebar">
          <div class="sidebar-content">
            <div class="sidebar-navs">
              <ul class="sidebar-nav">
                {(navs as any).map((group: any) => {
                  return <li class="sidebar-nav-item">
                    {group.groupName && <div class="sidebar-nav-item-text">
                      {group.groupName}
                    </div>}
                    {group.list && <ul>
                      {group.list.map((item: any) => {
                        return (<li class="sidebar-nest-nav-item">
                          {/* <router-link
                            to={{
                              path: `/components/${item.path}`,
                              query: 123,
                            }}
                          >
                            {
                              item.cnName
                                ? `${item.name} / ${item.cnName}`
                                : item.name
                            }
                          </router-link> */}
                          <a>{item.cnName
                            ? `${item.name} / ${item.cnName}`
                            : item.name}</a>
                        </li>)
                      })}
                    </ul>}
                  </li>
                })}
              </ul>
            </div >
          </div >
        </div>
      </div > : <div />)
  },
})
