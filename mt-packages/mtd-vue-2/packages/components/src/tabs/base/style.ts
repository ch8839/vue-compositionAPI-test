export function cssStyle(el: Element, ...styleName: string[]) {
  if (!el) {
    return {}
  }
  const style = window.getComputedStyle(el, null)
  return styleName.reduce((o, name) => {
    o[name] = parseFloat(style.getPropertyValue(name))
    return o
  }, {} as Record<string, number>)
}

export function autoprefixer(css: Record<string, string | number>) {
  const prefixer = ['ms', 'webkit']
  const style = ['transform']
  style.forEach((item) => {
    const cssValue = css[item]
    cssValue &&
      prefixer.forEach((fix) => {
        css[fix] = cssValue
      })
  })
  return css
}
