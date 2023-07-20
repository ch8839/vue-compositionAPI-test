/*eslint-disable*/
import { VNode } from 'vue';
import { ComponentRenderProxy } from '@ss/mtd-adapter';
declare global {
  namespace Vue {
    interface Element extends VNode { }
    interface ElementClass extends ComponentRenderProxy { }
    interface ElementAttributesProperty {
      $props: any; // specify the property name to use
    }
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }

}

export declare const window: any;

