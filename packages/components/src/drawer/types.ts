import { Component } from '@components/types/component'
import { getPopupContainer } from '@components/popper/types'

export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

export declare interface IDrawer extends Component {
  visible?: boolean;
  title?: string;
  width?: string | number;
  height?: string | number;
  closable?: boolean;
  mask?: boolean;
  maskClosable?: boolean;
  lockScroll?: boolean;
  placement?: DrawerPlacement;
  getPopupContainer?: getPopupContainer;
  appendToContainer?: boolean;
  destroyOnClose?: boolean;
}

declare const Drawer: IDrawer
export default Drawer
