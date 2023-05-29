/*eslint-disable*/

import Vue, { VNode } from 'vue';
import { ComponentRenderProxy } from '@ss/mtd-adapter';

declare global {
  namespace JSX {
    interface Element extends VNode {
    }
    interface ElementClass extends ComponentRenderProxy { }
    interface ElementAttributesProperty {
      $props: any; // specify the property name to use
    }
    interface IntrinsicElements {
      [elem: string]: any;
    }
    interface HTMLAttributes<T> {
      bg?: string
      text?: string
      font?: string
      p?: string
      m?: string
      border?: string
    }
  }

}
