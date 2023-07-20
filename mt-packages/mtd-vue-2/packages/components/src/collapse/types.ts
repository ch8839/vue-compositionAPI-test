import { Ref } from '@ss/mtd-adapter'
import { Emitter } from 'mitt'

export type CollapseType = '' | 'sample' | 'area';

export interface CollapseProvide {
  value: Ref<any>;
  rightAlignArrow: Ref<boolean>;
  triangleArrow: Ref<boolean>;
  emitter: Emitter<any>;
}

import Collapse from './index'

export type Collapse = InstanceType<typeof Collapse>
