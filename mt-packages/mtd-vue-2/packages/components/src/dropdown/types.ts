import { ComponentPublicInstance } from '@ss/mtd-adapter'
import { PopperPlacement, PopperTrigger, getPopupContainer } from '@components/popper/types'
import { Emitter } from '@utils/mitt'
export interface DropdownProvider {
  emitter: Emitter;
}

export declare interface IDropdown extends ComponentPublicInstance {
  visible?: boolean;
  trigger?: PopperTrigger;
  placement?: PopperPlacement;
  appendToContainer?: boolean;
  getPopupContainer?: getPopupContainer;

  popperClass?: any;
  showArrow: boolean;
  disabled: boolean;

  updatePopper(): void;
  dropdownClass?: any;
}
declare const Dropdown: IDropdown
export default Dropdown
