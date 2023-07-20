import {
  ComponentPublicInstance,
  CreateComponentPublicInstance,
} from 'vue'

export type Component = ComponentPublicInstance;
export type CPI = ComponentPublicInstance | CreateComponentPublicInstance<any>

export type MTDUIComponentSize = 'small' | '' | 'large';

