import { defineComponent, PropType, computed, classNames, styles, getSlotsInRender } from '@ss/mtd-adapter'
import { isString } from '@utils/type'
import { useConfig } from '@components/config-provider'

type teleportData = {
  nodes: any[],
  waiting: boolean,
  observer: MutationObserver | null,
  parent: HTMLElement | null,
}

export default defineComponent({
  name: 'TeleportMain',
  inheritAttrs: false,
  props: {
    // eslint-disable-next-line vue/require-prop-types
    to: {
      required: true,
    },
    where: {
      type: String,
      default: 'after',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('teleport'))

    const classes = computed(() => {
      if (props.disabled) {
        return prefix.value
      }
      return [prefix.value, `${prefix.value}-hidden`]
    })
    return {
      prefix, classes,
    }
  },
  data() {
    return {
      nodes: [],
      waiting: false,
      observer: null,
      parent: null,
    } as teleportData
  },
  watch: {
    to: 'maybeMove',
    where: 'maybeMove',
    disabled(value) {
      if (value) {
        this.disable()
        this.teardownObserver()
      } else {
        this.bootObserver()
        this.move()
      }
    },
  },
  mounted() {
    // Store a reference to the nodes

    this.nodes = Array.from(this.$el.childNodes)
    if (!this.disabled) {
      this.bootObserver()
    }
    // Move slot content to target
    this.maybeMove();
    const el = this.$refs.teleportWrapper as HTMLElement
    if (el && el.remove) {
      el.remove()
    } else if (el && (el as any).removeNode) {
      // to fix ie
      (el as any).removeNode()
    }
  },
  beforeDestroy() {
    // Move back
    this.disable()
    // Stop observing
    this.teardownObserver()
  },

  methods: {
    maybeMove() {
      if (!this.disabled) {
        this.move()
      }
    },
    move() {
      this.waiting = false
      if (isString(this.to)) {
        this.parent = document.querySelector(this.to)
      } else {
        this.parent = this.to as any
      }

      if (!this.parent) {
        this.disable()
        this.waiting = true
        return
      }
      if (this.where === 'before') {
        this.parent.prepend(this.getFragment())
      } else {
        this.parent.appendChild(this.getFragment())
      }
    },
    disable() {
      this.$el.appendChild(this.getFragment())
      this.parent = null
    },
    // Using a fragment is faster because it'll trigger only a single reflow
    // See https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
    getFragment() {
      const fragment = document.createDocumentFragment()
      this.nodes.forEach(node => fragment.appendChild(node))
      return fragment
    },
    onMutations(mutations: MutationRecord[]) {
      // Makes sure the move operation is only done once
      let shouldMove = false
      for (let i = 0; i < mutations.length; i++) {
        const mutation = mutations[i]
        const filteredAddedNodes = Array.from(mutation.addedNodes).filter(node => !this.nodes.includes(node))
        if (this.parent && Array.from(mutation.removedNodes).includes(this.parent)) {
          this.disable()
          this.waiting = !this.disabled
        } else if (this.waiting && filteredAddedNodes.length > 0) {
          shouldMove = true
        }
      }
      if (shouldMove) {
        this.move()
      }
    },
    bootObserver() {
      if (this.observer) {
        return
      }
      this.observer = new MutationObserver(mutations => this.onMutations(mutations))
      this.observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false,
      })
    },
    teardownObserver() {
      if (this.observer) {
        this.observer.disconnect()
        this.observer = null
      }
    },
  },
  render() {
    const { classes } = this
    return <div
      class={classNames(this, classes)}
      style={styles(this)}
      ref="teleportWrapper">
      {getSlotsInRender(this)}
    </div>
  },
})
