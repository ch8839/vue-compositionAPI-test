import { isServer } from './env'

export default function scrollIntoView(
  container: HTMLElement,
  selected: HTMLElement | undefined,
) {
  if (isServer) return

  if (!selected) {
    container.scrollTop = 0
    return
  }

  const offsetParents = []
  let pointer = selected.offsetParent as HTMLElement | null
  while (pointer && container !== pointer && container.contains(pointer)) {
    offsetParents.push(pointer)
    pointer = pointer.offsetParent as HTMLElement | null
  }
  const top =
    selected.offsetTop +
    offsetParents.reduce((prev, curr) => prev + curr.offsetTop, 0)
  const bottom = top + selected.offsetHeight
  const viewRectTop = container.scrollTop
  const viewRectBottom = viewRectTop + container.clientHeight

  if (top < viewRectTop) {
    container.scrollTop = top
  } else if (bottom > viewRectBottom) {
    container.scrollTop = bottom - container.clientHeight
  }
}
