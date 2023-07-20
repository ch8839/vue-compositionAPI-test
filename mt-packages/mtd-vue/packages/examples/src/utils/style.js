import Cookies from 'js-cookie'

const StyleElID = 'theme-style'
const LinkElID = 'theme-link'

export function createStyle () {
  const style = document.createElement('style')
  style.rel = 'stylesheet'
  style.type = 'text/css'
  style.id = StyleElID
  return style
}

export function setStyle (style, theme) {
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
    Cookies.set('MTD_THEME', theme, { expires: 365 })
    window.MTD_THEME = theme
  }
  clearLink()
}

export function clearStyle () {
  const styleEl = document.getElementById(StyleElID)
  if (styleEl) {
    styleEl.parentNode.removeChild(styleEl)
  }
}

export function createLink () {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.type = 'text/css'
  link.id = LinkElID
  return link
}

export function setLink (src) {
  let linkEl = document.getElementById(LinkElID)
  const needAppend = !linkEl

  linkEl = linkEl || createLink()
  linkEl.href = src
  if (needAppend) {
    const head = document.head
    head.appendChild(linkEl)
  }
  clearStyle()
}

export function clearLink () {
  const linkEl = document.getElementById(LinkElID)
  if (linkEl) {
    linkEl.parentNode.removeChild(linkEl)
  }
}
