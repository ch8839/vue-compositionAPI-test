import {
  // ComponentOptionsBase,
  ComponentPublicInstance,
  ComponentInstance,
} from '@ss/mtd-adapter'

export type Component = ComponentPublicInstance;
export type CPI = ComponentInstance | ComponentPublicInstance | any; // 🤡 ts 文件也要适配器

export type MTDUIComponentSize = 'small' | '' | 'large';
