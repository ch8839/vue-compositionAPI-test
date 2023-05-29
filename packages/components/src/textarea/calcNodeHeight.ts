const HIDDEN_TEXTAREA_STYLE = `
  min-height:0 !important;
  max-height:none !important;
  height:0 !important;
  visibility:hidden !important;
  overflow:hidden !important;
  position:absolute !important;
  z-index:-1000 !important;
  top:0 !important;
  right:0 !important
`

const SIZING_STYLE = [
  'letter-spacing',
  'line-height',
  'padding-top',
  'padding-bottom',
  'font-family',
  'font-weight',
  'font-size',
  'font-variant',
  'text-rendering',
  'text-transform',
  'width',
  'text-indent',
  'padding-left',
  'padding-right',
  'border-width',
  'box-sizing',
]

let hiddenTextarea: HTMLTextAreaElement | null

function getNodeFloatAttr(nodeStyle: any, attr: string) {
  return parseFloat(nodeStyle.getPropertyValue(attr) || 0)
}

function calcNodeStyling(node: HTMLTextAreaElement) {
  const style = window.getComputedStyle(node)
  const boxSizing = style.getPropertyValue('box-sizing')
  const paddingSize =
    getNodeFloatAttr(style, 'padding-bottom') +
    getNodeFloatAttr(style, 'padding-top')
  const borderSize =
    getNodeFloatAttr(style, 'border-bottom-width') +
    getNodeFloatAttr(style, 'border-top-width')

  const sizingStyle = SIZING_STYLE.map(
    (name) => `${name}:${style.getPropertyValue(name)}`,
  ).join(';')

  return { boxSizing, paddingSize, borderSize, sizingStyle }
}

export default function calcNodeHeight(
  node: HTMLTextAreaElement,
  minRows = 1,
  maxRows: number | null = null,
) {
  if (!hiddenTextarea) {
    hiddenTextarea = document.createElement('textarea')
    document.body.appendChild(hiddenTextarea)
  }

  const { boxSizing, paddingSize, borderSize, sizingStyle } = calcNodeStyling(
    node,
  )

  hiddenTextarea.setAttribute(
    'style',
    `${sizingStyle};${HIDDEN_TEXTAREA_STYLE}`,
  )
  hiddenTextarea.value = node.value || node.placeholder || ''

  let height = hiddenTextarea.scrollHeight

  if (boxSizing === 'border-box') {
    height = height + borderSize
  } else if (boxSizing === 'content-box') {
    height = height - paddingSize
  }

  hiddenTextarea.value = 'x'

  const result: { [key: string]: string } = {}
  const singleRowHeight = hiddenTextarea.scrollHeight - paddingSize

  if (minRows !== null) {
    let minHeight = singleRowHeight * minRows

    if (boxSizing === 'border-box') {
      minHeight = minHeight + paddingSize + borderSize
    }

    height = Math.max(minHeight, height)
    result.minHeight = `${minHeight}px`
  }
  if (maxRows !== null) {
    let maxHeight = singleRowHeight * maxRows

    if (boxSizing === 'border-box') {
      maxHeight = maxHeight + paddingSize + borderSize
    }

    height = Math.min(maxHeight, height)
  }

  result.height = `${height}px`
  hiddenTextarea.parentNode &&
    hiddenTextarea.parentNode.removeChild(hiddenTextarea)
  hiddenTextarea = null

  return result
}
