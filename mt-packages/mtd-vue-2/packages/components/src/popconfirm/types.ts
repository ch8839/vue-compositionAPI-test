import { IPopover } from '../popover/types'
export declare interface IPopconfirm extends IPopover {
  icon: string;
  message?: string;
  okButtonProps?: object;
  okButtonText: string;

  cancelButtonProps?: object;
  cancelButtonText: string;
}

export interface IPopconfirmProps {
  defaultVisible?: boolean
  visible?: boolean
}


declare const Popconfirm: IPopconfirm

export default Popconfirm
