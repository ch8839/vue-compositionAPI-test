import { provide, inject, computed, SetupContext } from "@ss/mtd-adapter"
import mitt from '@utils/mitt'
import { hasProp } from "@utils/vnode"
import vueInstance from "@hooks/instance"

import { RadioProps } from "@components/radio/props"
import { RadioGroup } from "@components/radio-group/types"

export type RadioButtonType = 'line' | 'fill' | 'slider'


export function useRadioProvider(ins: RadioGroup) {
  const emitter = mitt()
  provide<RadioGroup>('radioGroup', ins)
  return emitter
}

export function useRadioGroup(props: RadioProps, ctx: SetupContext) {
  const radioGroup = inject<RadioGroup | null>('radioGroup', null)
  const emitter = computed(() => {
    return radioGroup?.emitter
  })

  const ins = vueInstance()

  const _checked = computed((): boolean => {
    return radioGroup ? radioGroup.modelValue === props.value : !!props.value
  })

  const instance = vueInstance()

  const _disabled = computed(() => {
    return hasProp(instance, 'disabled')
      ? props.disabled
      : (radioGroup?.disabled || false)
  })

  const _size = computed((): string | undefined => {
    return hasProp(ins, 'size') ? props.size : (radioGroup?.size || undefined)
  })
  const _name = computed((): string | undefined => {
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
    _checked,
    _disabled,
    _size,
    _name,
    setChecked,
    type,
  }
}
