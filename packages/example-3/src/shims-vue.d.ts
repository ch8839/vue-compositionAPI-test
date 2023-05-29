declare module '*.vue' {
  import { defineComponent } from 'vue'
  const Component: ReturnType<typeof defineComponent>
  export default Component
}

declare module 'normalize-wheel' {
  const normalizeWheel: any
  export default normalizeWheel
}

declare module 'js-calendar' {
  const jsCalendar: any
  export default jsCalendar
}
declare const PUBLIC_PATH: string
