import { Ref, ref } from '@ss/mtd-adapter'

export const usePassword = (): [Ref<boolean>, () => void] => {
  const showPassword = ref(false)
  function handlePasswordIconClick() {
    showPassword.value = !showPassword.value
  }

  return [showPassword, handlePasswordIconClick]
}
