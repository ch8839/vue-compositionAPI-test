import { Component } from 'src/types/component'
import { getPopupContainer } from '@components/popper/types'
export { getPopupContainer } from '@components/popper/types'

export declare interface IModal extends Component {
  appendToContainer?: boolean;
  getPopupContainer?: getPopupContainer;
  mask?: boolean;
  closable?: boolean;
  maskClosable?: boolean;
  fullscreen?: boolean;
  visible?: boolean;
  destroyOnClose?: boolean;
  lockScroll?: boolean;
  title?: string;
  placement?: 'top' | 'center';
  width?: string | number;
}
declare const Modal: IModal
export default Modal
