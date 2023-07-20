/*eslint-disable*/
import { VNode } from 'vue';
import { ComponentRenderProxy } from '@vue/composition-api';
declare global {
  namespace Vue {
    interface Element extends VNode {}
    interface ElementClass extends ComponentRenderProxy {}
    interface ElementAttributesProperty {
      $props: any; // specify the property name to use
    }
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
}
