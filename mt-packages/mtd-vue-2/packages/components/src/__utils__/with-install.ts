import type { SFCWithInstall } from './types'

export const withInstall = <T, E extends Record<string, any>>( // eslint-disable-line
  main: T,
  extra?: E,
) => {
  (main as SFCWithInstall<T>).install = (app): void => {
    for (const comp of [main, ...Object.values(extra ?? {})]) {
      app.component(comp.name, comp)
    }
  }

  if (extra) {
    for (const [key, comp] of Object.entries(extra)) {
      (main as any)[key] = comp // eslint-disable-line
    }
  }
  return main as SFCWithInstall<T> & E
}
