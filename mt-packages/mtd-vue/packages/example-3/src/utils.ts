import Cookies from 'js-cookie'
const StyleElID = 'theme-style'
const LinkElID = 'theme-link'

export interface ITheme {
  value: string;
  label: string;
}

export function createStyle() {
  const style = document.createElement('style');
  (style as any).rel = 'stylesheet'
  style.type = 'text/css'
  style.id = StyleElID
  return style
}

export function setStyle(style: any, theme: ITheme) {
  let styleEl = document.getElementById(StyleElID)
  const needAppend = !styleEl
  styleEl = styleEl || createStyle()
  styleEl.innerHTML = style
  if (needAppend) {
    const firstStyle = document.head.getElementsByTagName('style')[0]
    if (firstStyle) {
      document.head.insertBefore(styleEl, firstStyle)
    } else {
      document.head.appendChild(styleEl)
    }
  }
  if (window.MTD_THEME !== theme) {
    Cookies.set('MTD_THEME', theme.value, { expires: 365 })
    window.MTD_THEME = theme
  }
  clearLink()
}

export function clearStyle() {
  const styleEl = document.getElementById(StyleElID)
  if (styleEl) {
    (styleEl as any).parentNode.removeChild(styleEl)
  }
}

export function createLink() {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.type = 'text/css'
  link.id = LinkElID
  return link
}

export function setLink(src: string) {
  let linkEl = document.getElementById(LinkElID)
  const needAppend = !linkEl
  linkEl = linkEl || createLink();
  (linkEl as any).href = src
  if (needAppend) {
    const head = document.head
    head.appendChild(linkEl)
  }
  clearStyle()
}

export function clearLink() {
  const linkEl = document.getElementById(LinkElID)
  if (linkEl) {
    (linkEl as any).parentNode.removeChild(linkEl)
  }
}

export function getComponentNav(navs: any[]) {
  return navs.find((nav) => nav.path === '/components')
}
