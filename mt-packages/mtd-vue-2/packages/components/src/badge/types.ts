export type BadgePlacement = 'top-end' | 'right' | 'left';
export type BadgeStatus =
  | 'error'
  | 'success'
  | 'process'
  | 'disabled'
  | 'warning';

import Badge from './index'

export type Checkbox = InstanceType<typeof Badge>