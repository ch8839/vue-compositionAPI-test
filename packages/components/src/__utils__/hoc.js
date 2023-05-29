function noop () {}

export default function createHoc (controlComponent = {}, options = {}) {
  return function (Component) {
    const definedProps = {
      ...controlComponent.props,
    }
    let modelProp
    let model
    if (controlComponent.model) {
      if (controlComponent.model === true || Component.model) {
        model = {
          prop: 'value',
          event: 'input',
          ...Component.model,
        }
      } else {
        model = controlComponent.model
      }
      modelProp = model.prop
      if (!definedProps[modelProp]) {
        definedProps[modelProp] = {}
      }
    }
    let WrappedComponent = Component
    while (WrappedComponent.WrappedComponent) {
      WrappedComponent = WrappedComponent.WrappedComponent
    }

    return {
      ...controlComponent,
      props: definedProps,
      model: model,
      name: controlComponent.name || `wrapper-${Component.name}`,
      WrappedComponent: WrappedComponent,
      inheritAttrs: false,
      render (h) {
        const childrens = Object.keys(this.$slots).map((name) => {
          const slot = this.$slots[name]
          if (name === 'default') {
            return slot
          }
          return h('template', { attrs: { slot: name }, slot: name }, slot)
        })
        const mapStateToProps = options.mapStateToProps || noop
        const mapToLisenter = options.mapMethodToListener || noop
        const getScopedSlots = options.getScopedSlots
        const getKey = options.key || noop
        const _props = mapStateToProps(this)
        const on = mapToLisenter(this)

        // 注入 v-model 绑定的属性
        if (modelProp && ! Object.hasOwnProperty.call(_props,modelProp)) {
          _props[modelProp] = this[modelProp]
        }

        const scopedSlots = getScopedSlots ? getScopedSlots(this,
          this.$scopedSlots) : this.$scopedSlots
        const attrs = {
          ...this.$attrs,
          ..._props,
        }
        return h(Component, {
          ref: options.withRef ? 'wrappedInstance' : undefined,
          key: getKey(attrs),
          attrs: attrs,
          on: {
            ...this.$listeners,
            ...on,
          },
          scopedSlots: scopedSlots,
        }, childrens)
      },
    }
  }
}
