import { CPI } from '@components/types/component'
import { PopperPlacement, PopperTrigger, getPopupContainer } from '../popper/types'

export declare interface IPopover extends CPI {
  transition?: string;
  disabled?: string;
  defaultVisible?: boolean;
  size?: 'small' | 'normal';
  title?: string;
  content?: string;
  popperClass?: string;

  visible?: boolean;
  appendToContainer?: boolean;
  getPopupContainer?: getPopupContainer;
  placement?: PopperPlacement;
  trigger?: PopperTrigger;
  showArrow?: boolean;
  openDelay?: number;
  closeDelay?: number;

  updatePopper(): void;
}
declare const Popover: IPopover
export default Popover
