import { CPI } from "@components/types/component"

export declare interface IAnchorLink extends CPI {
  href?: string;
  title?: string;
  scrollOffset?: number;
}

declare const AnchorLink: IAnchorLink
export default AnchorLink


