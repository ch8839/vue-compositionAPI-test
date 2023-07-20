import getElement from '@components/hooks/getElement'
const teleportHook = (props: any) => {
  const el = getElement()
  function createTele() {
    if (props.appendToContainer) {
      const getContainer = props.getPopupContainer
      const parent = getContainer()
      parent && parent.appendChild(el.value)
    }
    return true
  }
  function destroyTele() {
    if (el.value) {
      const parentNode = el.value.parentNode
      parentNode && parentNode.removeChild(el.value)
    }
  }

  return {
    createTele,
    destroyTele,
  }
}
export default teleportHook