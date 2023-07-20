import { Component } from 'src/types/component'
import { VNode } from 'vue'

export declare interface IMessage extends Component {
  close(): void;
}
export type MessageType = 'success' | 'info' | 'warning' | 'error' | 'loading';

interface handleClose {
  (): void;
}
export interface MessageOptions {
  icon?: string;
  message: string | VNode;
  type?: MessageType;
  dangerouslyUseHTMLString?: boolean;
  className?: string;
  duration?: number;
  showClose?: boolean;
  offset?: number;
  onClose?: handleClose;
}
export interface MessageInterface {
  readonly COMPONENT: Component;

  (options: MessageOptions): IMessage;
  (options: string): IMessage;

  success(options: MessageOptions): IMessage;
  success(message: string): IMessage;

  info(options: MessageOptions): IMessage;
  info(message: string): IMessage;

  warning(options: MessageOptions): IMessage;
  warning(message: string): IMessage;

  error(options: MessageOptions): IMessage;
  error(message: string): IMessage;

  loading(options: MessageOptions): IMessage;
  loading(message: string): IMessage;
}
export type TMessage = MessageInterface & {
  closeAll: () => void;
  close: (id: string) => void;
};
declare const Message: TMessage

export default Message
