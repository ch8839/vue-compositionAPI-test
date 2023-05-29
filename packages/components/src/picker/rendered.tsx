import {
  defineComponent,
  classNames, styles,
  getScopedSlotsInRender,
} from '@ss/mtd-adapter'
export default defineComponent({
  name: 'MtdRenderedResult',
  inheritAttrs: false,
  props: {
    placeholder: String,
    prefix: {
      type: String,
      required: true,
    },
    hasSelected: Boolean,
    value: [Object, Array], // any || any[]
  },
  emit: [],
  setup() { },
  render() {
    const { value, prefix, hasSelected, placeholder } = this

    const renderPlaceholder = getScopedSlotsInRender(this, 'placeholder')
    const renderSelected = getScopedSlotsInRender(this, 'selected')

    return <div
      class={classNames(this, `${prefix}-rendered`)}
      style={styles(this)}
    >
      <span class={`${prefix}-placeholder`} style={{ display: !hasSelected ? undefined : 'none' }}>
        {renderPlaceholder ? renderPlaceholder({ placeholder }) : placeholder}
      </span>
      {hasSelected && <span class={`${prefix}-values`}>
        {renderSelected && renderSelected(value)}
      </span>}
    </div>
  },
})
