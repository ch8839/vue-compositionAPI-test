import { provide, inject, computed, SetupContext, hasProp, ComponentPublicInstance } from '@ss/mtd-adapter'
import mitt from '@utils/mitt'
import vueInstance from '@hooks/instance'

import { RadioProps } from '@components/radio/props'
import { RadioGroup } from '@components/radio-group/types'

export type RadioButtonType = 'line' | 'fill' | 'slider'


export function useRadioProvider(ins: ComponentPublicInstance) {
  const emitter = mitt()
  provide<ComponentPublicInstance>('radioGroup', ins)
  return emitter
}

export function useRadioGroup(props: RadioProps, ctx: SetupContext) {
  const radioGroup = inject<RadioGroup | null>('radioGroup', null)
  const emitter = computed(() => {
    return radioGroup?.emitter
  })

  const ins = vueInstance()

  const m_checked = computed((): boolean => {
    return radioGroup ? radioGroup.modelValue === props.value : !!props.value
  })

  const instance = vueInstance()

  const m_disabled = computed(() => {
    return (hasProp(ins, 'disabled') && props.disabled !== undefined)
      ? props.disabled
      : (radioGroup?.m_disabled || false)
  })

  const m_size = computed((): string | undefined => {
    return hasProp(ins, 'size') ? props.size : (radioGroup?.size || undefined)
  })
  const m_name = computed((): string | undefined => {
    return props.name || (radioGroup?.name || undefined)
  })
  const type = computed((): RadioButtonType | undefined => {
    return radioGroup?.type
  })

  const setChecked = (newChecked: boolean) => {
    if (emitter.value) {
      emitter.value.emit('radioChange', props.value)
    } else {
      ctx.emit('input', newChecked)
      ctx.emit('update:value', newChecked)
      ctx.emit('change', newChecked)
    }
  }

  return {
    m_checked,
    m_disabled,
    m_size,
    m_name,
    setChecked,
    type,
  }
}
