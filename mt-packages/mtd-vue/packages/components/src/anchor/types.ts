import { CPI } from "@components/types/component"
import { Emitter } from '@utils/mitt'
export declare interface IAnchor extends CPI {
  // props
  affix: boolean;
  offsetTop: number;
  offsetBottom?: number;
  bounds: number;
  container?: string | HTMLElement;
  showInk: boolean;
  scrollOffset: number;

  // data
  currentLink: string;
  currentId: string;
  scrollContainer?: HTMLElement;
  scrollElement?: HTMLElement;
  emitter: Emitter;
}

declare const Anchor: IAnchor
export default Anchor