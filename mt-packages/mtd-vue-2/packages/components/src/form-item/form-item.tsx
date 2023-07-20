import {
  defineComponent,
  PropType,
  computed,
  reactive,
  markRaw,
  watch,
  onMounted,
  onBeforeUnmount,
  toRefs,
  hasProp,
  vueInstance,
  getSlotsInRender,
  getScopedSlotsInRender,
  Transition,
  vHtml,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import useFromItemProvide from './useProvide'
import useFromProvide from '../form/useProvide'

import mitt from '@utils/mitt'
import { FormRule, FormItemStatus } from './types'
import AsyncValidator from 'async-validator'
import { getPropByPath } from '@utils/util'
import { debounce } from '@utils/debounce'

export default defineComponent({
  name: 'MtdFormItem',
  inheritAttrs: true,
  props: {
    label: {
      type: String,
      default: '',
    },
    labelWidth: {
      type: Number,
    },
    prop: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: [Array, Object],
    },
    error: {
      type: String,
    },
    validateStatus: {
      type: String as PropType<FormItemStatus>,
    },
    validateMessage: String,
    hasFeedback: Boolean,
    showMessage: {
      type: Boolean,
      default: true,
    },
    labelFor: {
      type: String,
    },
    helper: {
      type: String,
    },
    helperPlacement: {
      type: String,
      default: 'bottom',
      validator: (v: string) => {
        return ['right', 'bottom'].indexOf(v) > -1
      },
    },
    validatePlacement: {
      type: String,
      default: 'bottom',
    },
    useHtmlMessage: Boolean,
    labelPosition: {
      type: String,
    },
    contentDisplay: {
      type: String,
    },
  },
  emits: [],
  setup(props, { slots }) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('form-item'))
    const ins = vueInstance()

    const { provideFormItem, injectFormItem } = useFromItemProvide()
    const { injectForm } = useFromProvide()
    provideFormItem(ins)
    const formItem = injectFormItem()
    const form = injectForm()

    const state = reactive({
      isRequired: false,
      innerValidateState: '',
      innerValidateMessage: props.error || '' as string,
      validateDisabled: false,
      fadeIn: false as boolean,
      emitter: markRaw(mitt()),

      initialValue: undefined as any,
    })

    // @Computed
    const isStatusControl = computed(() => hasProp(ins, 'validateStatus'))
    const isMessageControl = computed(() => hasProp(ins, 'validateMessage'))

    const status = computed(() => {
      if (isStatusControl.value) {
        return props.validateStatus
      } else {
        // 不受props控制的 form-item 状态 没有warning和success
        if (['warning', 'success'].indexOf(state.innerValidateState) > -1) return ''
        return state.innerValidateState
      }

    })
    const message = computed(() => isMessageControl.value ? props.validateMessage : state.innerValidateMessage)
    const m_contentDisplay = computed(() => props.contentDisplay ? props.contentDisplay : form.contentDisplay)
    const isNested = computed(() => formItem && form === formItem.form)
    const needShowError = computed(() => props.showMessage && form.showMessage)
    const showValidateMessage = computed(() => {
      return (status.value && status.value !== 'validating' && needShowError.value)
    })
    const classes = computed(() => {
      const error = state.fadeIn || state.innerValidateState === 'error'
      return {
        [`${prefix.value}-required`]: props.required || state.isRequired,
        [`${prefix.value}-error`]: error,
        [`${prefix.value}-validating`]: state.innerValidateState === 'validating',
        [`${prefix.value}-error-${props.validatePlacement}`]: error && needShowError.value,
        [`${prefix.value}-${$labelPosition.value}`]: $labelPosition.value,
      }
    })
    const fieldValue = computed(() => { // 🤡 cache:false
      const model = form.model
      if (!model || !props.prop) {
        return
      }

      let path = props.prop
      if (path.indexOf(':') !== -1) {
        path = path.replace(/:/, '.')
      }

      return getPropByPath(model, path).v
    })
    const realLabelWidth = computed(() => {
      return props.labelWidth || props.labelWidth === 0
        ? props.labelWidth
        : form.labelWidth
    })
    const $labelPosition = computed(() => props.labelPosition || form.labelPosition)
    const labelStyles = computed(() => {
      const style: any = {}
      if ($labelPosition.value === 'top') {
        return style
      }
      const labelWidth = realLabelWidth.value
      if (labelWidth) {
        style.width = `${labelWidth}px`
      }
      return style
    })
    const contentStyles = computed(() => {
      const style: any = {}
      if ($labelPosition.value === 'top') {
        return style
      }
      if (
        (form.inline || isNested.value) &&
        !props.label &&
        !slots.label
      ) {
        return style
      }
      const labelWidth = realLabelWidth.value
      if (labelWidth) {
        style.marginLeft = `${labelWidth}px`
      }

      style.display = m_contentDisplay.value
      return style
    })

    const labelSuffix = computed(() => {
      return form.labelSuffix
    })

    // @Watch
    watch(() => props.error, (val) => {
      state.innerValidateMessage = val || ''
      state.innerValidateState = val === '' ? '' : 'error'
    })
    watch(() => props.validateStatus, (val) => {
      state.innerValidateState = val || ''
    })
    watch(showValidateMessage, (val) => {
      if (val) {
        state.fadeIn = true
      }
    })
    watch(() => form.rules, () => {
      setRequired()
    })

    // @Created
    state.emitter.on('formBlur', onFieldBlur)
    state.emitter.on('formChange', onFieldChange)

    // @Mounted
    onMounted(() => {
      if (props.prop) {
        form.emitter.emit('addFormItem', ins)

        /*  🤡 Object.defineProperty(this, 'initialValue', {
      value: fieldValue.value,
    }) */
        state.initialValue = fieldValue.value
        setRequired()
      }
    })

    //@BeforeUnmount
    onBeforeUnmount(() => {
      form.emitter.emit('removeFormItem', ins)
    })


    // @Methods
    function setRequired() {
      const rules = getRules()

      if (rules.length) {
        rules.every((rule: any) => {
          if (rule.required) {
            state.isRequired = true
            return false
          }
        })
      }
    }

    function getRules() {
      let formRules = form.rules
      const selfRules = props.rules

      formRules = formRules && props.prop ? formRules[props.prop] : []

      const rules: FormRule[] = [].concat(selfRules || formRules || [])
      if (props.required && rules.every((rule) => !rule.required)) {
        rules.push({ required: true })
      }
      return rules
    }
    function getFilteredRule(trigger: string) {
      const rules = getRules()

      return rules.filter(
        (rule) =>
          !trigger || !rule.trigger || rule.trigger.indexOf(trigger) > -1,
      )
    }
    function validateSync(trigger: string, callback = function () { }) {
      const rules = getFilteredRule(trigger)
      if (!rules || rules.length === 0) {
        callback()
        return
      }

      state.innerValidateState = 'validating'

      const descriptor: any = {}
      descriptor[props.prop] = rules

      const validator = new AsyncValidator(descriptor)
      const model = {
        ...form.model,
      }

      model[props.prop] = fieldValue.value
      const firstFields = form.firstFields

      validator.validate(model, { firstFields }, (errors) => {
        state.innerValidateState = !errors ? 'success' : 'error'
        state.innerValidateMessage = errors ? (errors[0].message || '') : '';
        (callback as any)(state.innerValidateMessage)
      })
      state.validateDisabled = false
    }

    // 表单校验防抖
    const validate = debounce(300, validateSync)

    function resetField() {
      state.innerValidateState = ''
      state.innerValidateMessage = ''

      const model = form.model
      const value = fieldValue.value
      let path = props.prop
      if (path.indexOf(':') !== -1) {
        path = path.replace(/:/, '.')
      }

      const prop = getPropByPath(model, path)
      if (Array.isArray(value)) {
        state.validateDisabled = true
        // 避免初值是非数组的情况（例如select多选 初始值为空字符串）
        prop.o[prop.k] = [].concat(Array.isArray(state.initialValue) ? state.initialValue as any : [])
      } else {
        state.validateDisabled = true
        prop.o[prop.k] = state.initialValue
      }
    }
    function clearValidate() {
      state.innerValidateState = ''
      state.innerValidateMessage = ''
      state.validateDisabled = false
    }
    function onFieldBlur() {
      validate('blur')
    }
    function onFieldChange() {
      if (state.validateDisabled) {
        state.validateDisabled = false
        return
      }
      validate('change')
    }
    function handleAfterLeave() {
      state.fadeIn = false
    }

    const computedCollection = {
      classes, labelStyles, contentStyles, showValidateMessage, status, message, isStatusControl, labelSuffix, m_contentDisplay,
    }
    const methodsCollection = {
      resetField,
      clearValidate,
      validate,
      handleAfterLeave,
    }


    return {
      ...toRefs(state),
      ...computedCollection,
      ...methodsCollection,
      prefix,
      disabled: form ? form.disabled : false,
    }

  },
  render() {
    const {
      prefix, classes, labelFor, labelStyles, label, contentStyles, helperPlacement,
      helper, showValidateMessage, validatePlacement, useHtmlMessage, labelSuffix,
      message, status, m_contentDisplay,
    } = this

    const renderHelper = () => < Transition
      name="fade-in"
      enter-from-class={'fade-in' + '-enter'}
      onAfter-leave={this.handleAfterLeave}
    >
      {(getSlotsInRender(this, 'helper') || helper) &&
        <div class={{
          [`${prefix}-helper`]: true,
          [`${prefix}-helper-right`]: helperPlacement === 'right',
        }}>
          {getSlotsInRender(this, 'helper') || helper}
        </div>
      }
    </Transition>

    return <div class={[prefix, classes]}>

      {(label || getSlotsInRender(this, 'label')) &&
        <label
          class={`${prefix}-label`}
          for={labelFor}
          style={labelStyles}
        >
          {getSlotsInRender(this, 'label') || label}{labelSuffix}
        </label>
      }

      <div class={`${prefix}-content`} style={contentStyles}>
        {getSlotsInRender(this)}
        {helperPlacement === 'right' &&
          renderHelper()
        }
        <Transition name="fade-in" enter-from-class={'fade-in' + '-enter'} onAfter-leave={this.handleAfterLeave} >
          {showValidateMessage &&
            <div
              class={{
                [`${prefix}-${status}-tip`]: true,
                [`${prefix}-${status}-tip-right`]: validatePlacement === 'right',
              }}
            >
              {getScopedSlotsInRender(this, 'error')
                ? getScopedSlotsInRender(this, 'error')?.({ message: message })
                : useHtmlMessage
                  ? <div {...vHtml(message)} />
                  : message
              }
            </div >
          }
        </Transition >
        {(helperPlacement !== 'right') &&
          renderHelper()
        }
      </div >
    </div >
  },
})
