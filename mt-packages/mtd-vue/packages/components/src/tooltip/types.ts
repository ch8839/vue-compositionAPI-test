import { Component } from '@components/types/component'
import {
  IPopper,
  PopperPlacement,
  PopperTrigger,
  getPopupContainer,
} from '@components/popper/types'

export declare interface ITooltip extends Component {
  disabled?: boolean;
  visible?: boolean;
  defaultVisible?: boolean;
  size?: 'small' | 'normal';
  content?: string;
  popperClass?: string;

  placement?: PopperPlacement;
  trigger?: PopperTrigger;
  showArrow?: boolean;
  openDelay?: number;
  closeDelay?: number;

  appendToContainer?: boolean;
  getPopupContainer?: getPopupContainer;

  updatePopper(): void;
  getPopper(): IPopper;
}

declare const Tooltip: ITooltip
export default Tooltip
