import { Component } from 'src/types/component'
import { VNode } from 'vue'
export declare interface INotification extends Component {
  close(): void;
}
export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export type NotificationPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

interface handleClose {
  (): void;
}
export interface NotificationOptions {
  title?: string;
  message: string | VNode;
  type?: NotificationType;
  className?: string;
  icon?: string;
  dangerouslyUseHTMLString?: boolean;
  duration?: number;
  showClose?: boolean;
  onClose?: handleClose;
  offset?: number;
  position?: NotificationPosition;


  fillColor?: boolean
}
export interface NotificationData {
  visible: boolean;
  closed: boolean;
  timer: number;
  verticalOffset?: number;
  zIndex?: number;
  emitter: any;
  mountTime: string;
}
export interface NotificationInterface {
  readonly COMPONENT: Component;
  (options: NotificationOptions): INotification;
  (options: string): INotification;

  success(options: NotificationOptions): INotification;
  success(message: string): INotification;

  info(options: NotificationOptions): INotification;
  info(message: string): INotification;

  warning(options: NotificationOptions): INotification;
  warning(message: string): INotification;

  error(options: NotificationOptions): INotification;
  error(message: string): INotification;

}
export type TNotification = NotificationInterface & {
  closeAll: () => void;
  close: (id: string) => void;
};
declare const Notification: TNotification

export default Notification
