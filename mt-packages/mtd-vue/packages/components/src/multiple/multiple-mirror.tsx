import { useConfig } from '@components/config-provider'
import {
  computed,
  defineComponent,
  classNames, styles,
} from '@ss/mtd-adapter'


export default defineComponent({
  name: 'MtdMultipleMirror',
  inheritAttrs: false,
  props: {
    prefix: String,
    readonly: Boolean,
  },
  setup() {
    const config = useConfig()
    const prefixMTD = computed(() => config.getPrefix())
    return {
      prefixMTD,
    }
  },
  data() {
    return {
      query: '',
      searchWidth: 5,
      minWidth: 5,
      isComposing: false,
      offset: 5, // define in css
    }
  },
  watch: {
    query() {
      this.$nextTick(this.computedInputWidth)
    },
  },
  mounted() {
    const { searchWidth } = this
    const { input } = this.$refs
    if (input) {
      (input as any).style.width = `${searchWidth}px`
    }
  },
  methods: {
    // public
    reset() {
      this.query = ''
    },
    focus() {
      (this.$refs.input as any).focus()
    },
    blur() {
      (this.$refs.input as any).blur()
    },
    // private
    handleChange(event: Event) {
      if (event.target) {
        this.query = (event.target as any).value
      }
      this.$emit('input', this.query) // 上一级需要根据输入内容来显隐 placeholder
      if (!this.isComposing) {
        this.$emit('query', this.query)
      }
    },
    handleComposition(e: Event) {
      const { type } = e
      if (type === 'compositionend') {
        this.isComposing = false
        this.handleChange(e)
      } else {
        this.isComposing = true
      }
    },
    handleFocus(e: Event) {
      this.$emit('focus', e)
    },
    handleBlur(e: Event) {
      this.$emit('blur', e)
    },
    handleKeydown() {

    },
    computedInputWidth() {
      const { input, text } = this.$refs
      if (input && text) {
        const width = this.searchWidth = (text as HTMLElement).scrollWidth;
        (input as any).style.width = `${width}px`
      }
    },
  },
  render() {
    const { minWidth, query, readonly, prefixMTD } = this
    return <div
      class={classNames(this, `${prefixMTD}-select-search-line`)}
      style={styles(this)}
    >
      <span ref="text" class={`${prefixMTD}-select-multiple-mirror`}>{query}</span>
      <input class={`${prefixMTD}-select-search-field`} tabindex="-1"
        ref="input" style={{
          minWidth: `${minWidth}px`,
        }}
        value={query}
        readonly={readonly}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        onInput={this.handleChange}
        onKeydown={this.$listeners.keydown || this.handleKeydown}
        onCompositionstart={this.handleComposition}
        onCompositionupdate={this.handleComposition}
        onCompositionend={this.handleComposition}
      />
    </div>
  },
})
