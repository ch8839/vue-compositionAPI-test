import { VNode } from 'vue'

import { getPopupContainer } from '@components/popper/types'
import { CPI } from '@components/types/component'
export declare interface IConfirmComponent extends CPI {
  className?: string
  type?: 'success' | 'info' | 'warning' | 'error'
  title?: string
  width?: number | string
  message?: string | VNode

  attrs: { [key: string]: any }

  okButtonProps?: object
  okButtonText?: string

  cancelButtonProps?: object
  cancelButtonText?: string

  showOkButton?: boolean
  showCancelButton?: boolean

  closable?: boolean
  maskClosable?: boolean

  handleOk(): void
  handleCancel(): void
  close(): void
}

interface ConfirmData {
  action: 'confirm' | 'cancel' | 'close';
}

interface confirmCallbackHandler {
  (data: ConfirmData): void;
}

export interface ConfirmOptions {
  className?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  title?: string;
  width?: number | string;
  message: string | VNode;
  okButtonProps?: object;
  okButtonText?: string;

  cancelButtonProps?: object;
  cancelButtonText?: string;

  showOkButton?: boolean;
  showCancelButton?: boolean;

  closable?: boolean;
  maskClosable?: boolean;
  onOk?: confirmCallbackHandler;
  onCancel?: confirmCallbackHandler;
  dangerouslyUseHTMLString?: boolean;
  getPopupContainer?: getPopupContainer;
}

export interface ConfirmInterface {
  readonly COMPONENT: CPI;
  (options: ConfirmOptions): Promise<ConfirmData>;
}

export type TConfirm = ConfirmInterface & {
  closeAll: () => void;
  getInstance: () => IConfirmComponent | undefined;
};

declare const Confirm: TConfirm

export default Confirm
