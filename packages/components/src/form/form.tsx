import {
  defineComponent,
  computed,
  reactive,
  markRaw,
  toRefs,
  watch,
  vueInstance,
  getSlotsInRender,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import { noop } from '@utils/util'
import mitt from '@utils/mitt'
import { isString } from '@utils/type'
import useFromProvide from './useProvide'
import { FormItemIns } from '../form-item/types'

export default defineComponent({
  name: 'MtdForm',
  inheritAttrs: true,
  props: {
    model: {
      type: Object,
    },
    rules: {
      type: Object,
    },
    labelWidth: {
      type: Number,
      default: 100,
    },
    labelPosition: {
      type: String,
      validator: (value: string) => {
        return ['right', 'top', 'left'].indexOf(value) > -1
      },
      default: 'right',
    },
    showMessage: {
      type: Boolean,
      default: true,
    },
    inline: {
      type: Boolean,
      default: false,
    },
    autocomplete: {
      type: String,
      validator: (value: string) => {
        return ['on', 'off'].indexOf(value) > -1
      },
      default: 'off',
    },
    firstFields: {
      type: Boolean,
      default: true,
    },
    labelSuffix: String,
    contentDisplay: {
      type: String,
      default: 'block',
    },
    disabled: Boolean,
    validateOnRuleChange: {
      type: Boolean,
      default: true,
    },
  },
  emits: [],
  setup(props) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('form'))
    const prefixMTD = computed(() => config.getPrefix())
    const ins = vueInstance()

    const state = reactive({
      emitter: markRaw(mitt()),
      fields: [] as FormItemIns[],
    })

    const { provideForm } = useFromProvide()
    provideForm(ins)

    // @Computed
    const classes = computed(() => {
      return [
        `${prefixMTD.value}-form-${props.labelPosition}`,
        {
          [`${prefixMTD.value}-form-inline`]: props.inline,
        },
      ]
    })

    // @Watch
    watch(() => props.rules, () => {
      if (props.validateOnRuleChange) {
        validate().catch(function (e) { })
      }
    })

    // @Created
    state.emitter.on('addFormItem', (field: FormItemIns) => {
      if (field && field.prop) state.fields.push(field)
      return false
    })
    state.emitter.on('removeFormItem', (field: FormItemIns) => {
      if (field.prop) state.fields.splice(state.fields.indexOf(field), 1)
      return false
    })

    // @Methods
    // 对整个表单进行重置，将所有字段值重置为空并移除校验结果
    function resetFields(props: string | string[]) {
      const fields =
        props && props.length
          ? isString(props)
            ? state.fields.filter((field) => props === field.prop)
            : state.fields.filter((field) => props.indexOf(field.prop) > -1)
          : state.fields
      fields.forEach((field) => {
        field.resetField()
      })
    }
    function validate(callback?: Function) {
      return new Promise<void>((resolve, reject) => {
        let valid = true
        let count = 0
        const callbackFn = callback || noop
        const errors: any = {}
        if (!state.fields.length) {
          callbackFn(valid)
          return resolve()
        }
        state.fields.forEach((field) => {
          field.validate('', (error: string) => {
            if (error) {
              valid = false
              errors[field.prop] = error
              errors.$$mtd = true
            }
            if (++count === state.fields.length) {
              // all finish
              callbackFn(valid, errors)
              valid ? resolve() : reject(errors)
            }
          })
        })
      })
    }
    function validateFields(props: string | string[], callback: Function) {
      const fields = props && props.length
        ? (isString(props)
          ? state.fields.filter(field => props === field.prop)
          : state.fields.filter(field => props.indexOf(field.prop) > -1)
        ) : state.fields
      if (props && props.length && !fields.length) {
        throw new Error(
          '[warn]: must call validateField with valid prop string!',
        )
      }

      const callbackFn = callback || noop

      // run validate
      let valid = true
      let count = 0
      const errors: any = {}
      if (!fields.length) {
        callbackFn(valid)
      }
      fields.forEach(field => {
        field.validate('', (error: string) => {
          if (error) {
            valid = false
            errors[field.prop] = error
            errors.$$mtd = true
          }
          if (++count === fields.length) {
            // all finish
            callbackFn(valid, errors)
          }
        })
      })
    }
    function validateField(prop: string, cb: Function) {
      const field = state.fields.find((field) => field.prop === prop)
      if (!field) {
        throw new Error(
          '[warn]: must call validateField with valid prop string!',
        )
      }
      return field.validate('', cb)
    }
    function clearValidate(props: string | string[]) {
      const fields = props.length
        ? isString(props)
          ? state.fields.filter((field) => props === field.prop)
          : state.fields.filter((field) => props.indexOf(field.prop) > -1)
        : state.fields
      fields.forEach((field) => {
        field.clearValidate()
      })
    }

    const computedCollection = {
      classes,
    }
    const methodsCollection = {
      resetFields,
      validate,
      validateFields,
      validateField,
      clearValidate,
    }

    return {
      prefix,
      ...toRefs(state),
      ...computedCollection,
      ...methodsCollection,
    }
  },
  render() {
    const {
      prefix, classes, autocomplete,
    } = this
    return <form
      class={[prefix, classes]}
      autocomplete={autocomplete}
    >
      {getSlotsInRender(this)}
    </form>
  },
})
