import { ComponentPublicInstance } from '@ss/mtd-adapter'
import PopperJS from 'popper.js'
export type PopperTrigger = 'click' | 'focus' | 'hover' | 'custom';

export type PopperPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

export interface getPopupContainer {
  (): HTMLElement;
}
export interface IPopper {
  visible?: boolean;
  appendToContainer?: boolean;
  // getPopupContainer?: getPopupContainer
  placement?: PopperPlacement;
  popperOptions?: object;
  trigger?: PopperTrigger;
  popperDisabled?: boolean;
  showArrow?: boolean;
  openDelay?: number;
  closeDelay?: number;

  updatePopper(): void;
  destroy(): void;
  init(): void;
  setReferenceEl(el?: HTMLElement): void;
}

export interface PopperProvideFun {
  registerDrop(drop: ComponentPublicInstance): void;
  registerReference(reference: ComponentPublicInstance): void;
}

export interface PopperInstance extends IPopper, PopperProvideFun {
  popperJS?: PopperJS;
  drop?: HTMLElement;
  _timer?: number;
  referenceRef?: any;
  dropRef?: any;
}

declare const Popper: IPopper
export default Popper
