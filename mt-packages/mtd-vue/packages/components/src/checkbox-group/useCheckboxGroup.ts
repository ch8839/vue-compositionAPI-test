import { inject, provide, computed, SetupContext } from "@ss/mtd-adapter"
import { Emitter } from '@utils/mitt'
import { hasProps } from "@components/picker/util"
import vueInstance from "@components/hooks/instance"
import { CheckboxProps } from "@components/checkbox/props"
import { CheckboxGroup } from "@components/checkbox-group/types"

export function provideCheckboxGroup(context: CheckboxGroup) {
  provide('checkboxGroup', context)
}

export const useCheckboxGroup = (props: CheckboxProps, ctx: SetupContext) => {
  const ins = vueInstance()
  const checkboxGroup = inject<CheckboxGroup | null>('checkboxGroup', null)

  const _isUnderControl = computed(() => {
    return props.isUnderControl && checkboxGroup
  })
  const emitter = computed((): Emitter | undefined => {
    return checkboxGroup?.emitter
  })


  const checked = computed((): boolean => {
    return _isUnderControl.value
      ? checkboxGroup!.modelValue.indexOf(props.value) > -1
      : props.value === props.trueValue
  })

  const _disabled = computed(() => {
    return _isUnderControl.value && !hasProps(ins, 'disabled')
      ? checkboxGroup!.disabled
      : props.disabled
  })
  const _size = computed((): string | undefined => {
    return _isUnderControl.value ? checkboxGroup!.size : props.size
  })
  const _name = computed((): string | undefined => {
    return _isUnderControl.value ? checkboxGroup!.name : props.name
  })

  const changeChecked = () => {
    const reverseChecked = !checked.value
    if (_isUnderControl.value) {
      emitter!.value!.emit('checkboxChange', reverseChecked, props.value)
    } else {
      ctx.emit('input', getCheckedValue(reverseChecked))
      ctx.emit('update:value', getCheckedValue(reverseChecked))
      ctx.emit('change', getCheckedValue(reverseChecked))
    }
  }

  const getCheckedValue = (checked: boolean) => checked ? props.trueValue : props.falseValue

  return {
    checked,
    _disabled,
    _size,
    _name,
    changeChecked,
  }
}
