import { inject, provide, computed, SetupContext, hasProp, ComponentPublicInstance } from '@ss/mtd-adapter'
import { Emitter } from '@utils/mitt'
import vueInstance from '@components/hooks/instance'

import { CheckboxProps } from '@components/checkbox/props'
import { CheckboxGroup } from '@components/checkbox-group/types'

import { useFormItem } from '@components/form-item/useFormItem'

export function provideCheckboxGroup(ins: ComponentPublicInstance) {
  provide('checkboxGroup', ins)
}

export const useCheckboxGroup = (props: CheckboxProps, ctx: SetupContext) => {
  const ins = vueInstance()
  const checkboxGroup = inject<CheckboxGroup | null>('checkboxGroup', null)

  const m_isUnderControl = computed(() => {
    return props.isUnderControl && checkboxGroup
  })
  const emitter = computed((): Emitter | undefined => {
    return checkboxGroup?.emitter
  })


  const checked = computed((): boolean => {
    return m_isUnderControl.value
      ? checkboxGroup!.modelValue.indexOf(props.value) > -1
      : props.value === props.trueValue
  })

  const formItemHook = useFormItem(props, ctx)

  const m_disabled = computed(() => {

    return (m_isUnderControl.value && !(hasProp(ins, 'disabled') && props.disabled !== undefined))
      ? checkboxGroup!.m_disabled
      : formItemHook.disabled.value
  })
  const m_size = computed((): string | undefined => {
    return m_isUnderControl.value ? checkboxGroup!.size : props.size
  })
  const m_name = computed((): string | undefined => {
    return m_isUnderControl.value ? checkboxGroup!.name : props.name
  })

  const changeChecked = () => {
    const reverseChecked = !checked.value
    if (m_isUnderControl.value) {
      emitter.value!.emit('checkboxChange', reverseChecked, props.value)
    } else {
      ctx.emit('input', getCheckedValue(reverseChecked))
      ctx.emit('update:value', getCheckedValue(reverseChecked))
      ctx.emit('change', getCheckedValue(reverseChecked))
    }
  }

  const getCheckedValue = (checked: boolean) => checked ? props.trueValue : props.falseValue

  return {
    checked,
    m_disabled,
    m_size,
    m_name,
    changeChecked,
  }
}
