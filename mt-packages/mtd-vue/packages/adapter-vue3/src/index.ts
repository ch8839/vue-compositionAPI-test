import { App } from 'vue'

export function test() {
  console.log('我是Vue3')
}

export function install(app: App, components: any[]) {
  components.map((component) => {
    app.use(component);
  });
}

export * from './hooks'
export * from './utils'

export * from 'vue'