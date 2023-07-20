import {
  ComponentPublicInstance, ComponentRenderProxy,
} from '@vue/composition-api'

export type Component = ComponentPublicInstance;
export type CPI = ComponentPublicInstance | ComponentRenderProxy<any>

export type MTDUIComponentSize = 'small' | '' | 'large';
