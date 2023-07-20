import VueRouter from 'vue-router'
import navConfig from './nav.config.json'
import eventhub from './utils/eventhub'
import SidebarExample from './pages/sidebar-example.vue'
import DocsPage from './pages/docs.vue'

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return originalPush.call(this, location).catch(err => err)
}


function loadDocs(component: string): any {
  return (r: any) => {
    require.ensure([], () => {
      let comp
      try {
        comp = require(`@components/${component}/index.md`)
      } catch (e) {
        console.error(`不能获取到组件 ${component} 的文档`, e)
      }
      r(comp)
    }, 'demo')
  }
}

function loadPage(component: string) {
  return (r: any) => {
    require.ensure([], () =>
      r(require(`./pages/${component}.vue`)), 'demo')
  }
}

/**
 *
 * route: {
 *   path: '/component',
 *   component: import from './pages/component.vue',
 *   child: registerRoute(navConfig)
 * }
 */
function toRoute(navs: Array<any>) {
  function createRoute(page: any, { isPage }: { isPage?: boolean } = {}) {
    const { path } = page
    const componentName = path.charAt('0') === '/' ? path.substr(1) : path
    const component = isPage ? loadPage(componentName)
      : loadDocs(componentName)
    let children
    if (componentName === 'sidebar') {
      children = [{
        path: ':name',
        name: 'sidebar-example',
        component: SidebarExample,
      }]
    }
    return {
      ...page,
      groups: undefined,
      path: path,
      meta: {
        title: page.title || page.name,
        description: page.description,
      },
      component: component.default || component,
      children,
    }
  }

  return navs.reduce((routes, nav) => {
    if (!nav.href) {
      const route = createRoute(nav, { isPage: true })
      route.meta.navbar = nav.name
      if (nav.groups) {
        const children: Array<any> = []
        nav.groups.forEach((group: any) => {
          Array.prototype.push.apply(children, group.list.map((nav: any) => {
            return createRoute(nav)
          }))
        })
        route.children = children
      }
      routes.push(route)
    }
    return routes
  }, [])
}

const navRoute = toRoute(navConfig)

const defaultPath = '/components'
const routes = navRoute.concat([{
  path: '/',
  redirect: defaultPath,
}, {
  path: '*',
  redirect: defaultPath,
}, {
  path: '/components/simulate',
  component: loadDocs('simulate'),
}, {
  path: '/doc',
  component: DocsPage,
  redirect: '/doc/getting-started',
  name: 'doc',
  meta: {
    navbar: 'doc',
  },
  children: [{
    path: 'getting-started',
    name: 'getting-started',
    component: (r: any) => {
      require.ensure([], () =>
        r(require('./wiki/getting-started.md')), 'started')
    },
  }, {
    path: 'customize-theme',
    name: 'customize-theme',
    component: (r: any) => {
      require.ensure([], () =>
        r(require('./wiki/customize-theme.md')), 'started')
    },
  }, {
    path: 'changelog',
    name: 'changelog',
    component: (r: any) => {
      require.ensure([], () =>
        r(require('./CHANGELOG.md')), 'started')
    },
  }, {
    path: 'compatibility',
    name: 'compatibility',
    component: (r: any) => {
      require.ensure([], () =>
        r(require('./wiki/compatibility.md')), 'started')
    },
  }],
}])

const router = new VueRouter({
  mode: 'history',
  base: PUBLIC_PATH,
  routes,
})

router.beforeEach((to, from, next) => {
  eventhub.emit('change-router')
  next()
})
export default router
