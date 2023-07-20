import {
  getPrefix,
  getPrefixCls,
  getIconCls,
  getIconPrefix,
  getPopupContainer,
  getConfig,
  Config,
} from './config'
import {
  provide,
  inject,
  computed,
  ComputedRef,
} from '@ss/mtd-adapter'

const CONFIG_PROVIDER = 'MTD_NEXT_Config'

// skip undefined prop merged and return new object.
function combine(option1: any, option2: any) { // eslint-disable-line
  const option = { ...option1 }
  Object.keys(option2).forEach((key) => {
    const value = option2[key]
    if (value !== undefined) {
      option[key] = value
    }
  })
  return option
}

interface ConfigContextOptions {
  prefixCls?: string
  iconPrefixCls?: string
  getPopupContainer?: () => HTMLElement
}

export interface ConfigContext {
  options: ComputedRef<ConfigContextOptions>
  getPrefix(): string
  getPrefixCls(suffixCls: string): string
  getIconCls(suffixCls?: string): string
  getIconPrefix(): string
  getPopupContainer(): HTMLElement
}

export function useConfig(): ConfigContext {
  const defaultOptions = computed(() => {
    return getConfig()
  })
  const config = inject<ConfigContext>(CONFIG_PROVIDER, {
    options: defaultOptions,
    getPrefix,
    getPrefixCls,
    getIconCls,
    getPopupContainer,
    getIconPrefix,
  })
  return config
}

export function useConfigProvider(opt: ConfigContextOptions) {
  const parentConfig = useConfig()

  const options = computed<Config>(() => {
    return combine(parentConfig.options.value, opt)
  })

  const prefix = computed<string>(() => {
    return options.value.prefixCls
  })

  const iconPrefix = computed<string>(() => {
    return options.value.iconPrefixCls
  })

  const getPrefixCls = (suffixCls: string) => {
    return `${prefix.value}-${suffixCls}`
  }
  const getPrefix = () => {
    return prefix.value
  }

  const getIconCls = (suffixCls?: string) => {
    return suffixCls ? `${iconPrefix.value} ${iconPrefix.value}-${suffixCls}` : iconPrefix.value
  }

  const context: ConfigContext = {
    options: options,
    getPrefix,
    getPrefixCls,
    getIconCls,
    getIconPrefix,
    getPopupContainer: options.value.getPopupContainer,
  }

  provide<ConfigContext>(CONFIG_PROVIDER, context)
  return context
}

export default useConfig
