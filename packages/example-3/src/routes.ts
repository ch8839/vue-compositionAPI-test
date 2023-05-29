import { createRouter, createWebHistory } from 'vue-router'
import navConfig from './nav.config.json'
import SidebarExample from './pages/sidebar-example.vue'
import eventhub from './common/eventhub'
import DocsPage from './pages/docs.vue'

const defaultPath = '/components'

function loadDocs(component: string) {
  return () => {
    return require.ensure(
      [],
      () => {
        let comp
        try {
          comp = require(`@components/${component}/index.md`)
          return comp
        } catch (e) {
          console.error(`不能获取到组件 ${component} 的文档`, e)
        }
      },
      'demo',
    )
  }
}

function loadPage(component: string): any {
  return () => {
    return require.ensure(
      [],
      () => {
        return require(`./pages/${component}.vue`)
      },
      'demo',
    )
  }
}

function toRoute(navs: any) {
  function createRoute(page: any, { isPage }: { isPage?: boolean } = {}) {
    const { path } = page
    const componentName = path.charAt('0') === '/' ? path.substr(1) : path
    const component = isPage
      ? loadPage(componentName)
      : loadDocs(componentName)
    let children
    if (componentName === 'sidebar') {
      children = [
        {
          path: ':name',
          name: 'sidebar-example',
          component: SidebarExample,
        },
      ]
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

  return navs.reduce((routes: any, nav: any) => {
    if (!nav.href) {
      const route = createRoute(nav, { isPage: true })
      route.meta.navbar = nav.name
      if (nav.groups) {
        const children: any = []
        nav.groups.forEach((group: any) => {
          Array.prototype.push.apply(
            children,
            group.list.map((nav: any) => {
              return createRoute(nav)
            }),
          )
        })
        route.children = children
      }
      routes.push(route)
    }
    return routes
  }, [])
}
const navRoute = toRoute(navConfig)

const routes = navRoute.concat([
  {
    path: '/',
    redirect: defaultPath,
  },
  {
    path: '/*',
    redirect: defaultPath,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: defaultPath,
  },
  {
    path: '/components/simulate',
    component: loadDocs('simulate'),
  },
  {
    path: '/components/virtual',
    component: loadDocs('virtual'),
  },
  {
    path: '/doc',
    component: DocsPage,
    name: 'doc',
    meta: {
      navbar: 'doc',
    },
    redirect: '/doc/getting-started',
    children: [
      {
        path: 'getting-started',
        component: () => {
          return require.ensure(
            [],
            () => require('./wiki/getting-started.md'),
            'started'
          );
        },
      },
      {
        path: 'customize-theme',
        component: () => {
          return require.ensure(
            [],
            () => require('./wiki/customize-theme.md'),
            'started'
          );
        },
      },
      {
        path: 'changelog',
        component: () => {
          return require.ensure(
            [],
            () => require('./CHANGELOG.md'),
            'started'
          );
        },
      },
    ],
  },
])

const router = createRouter({
  history: createWebHistory(PUBLIC_PATH),
  routes,
})

router.beforeEach((to, from, next) => {
  eventhub.emit('change-router')
  next()
})
export default router
