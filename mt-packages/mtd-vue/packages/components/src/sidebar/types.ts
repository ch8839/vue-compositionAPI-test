import { CPI } from "@components/types/component"

export interface SidebarData {
  [key: string]: any;
  title: string;
  tooltip?: string;
  disabled: boolean;
  route?: string | object;
  replace: boolean;
  exact: boolean;
  href?: string;
  blank?: string;
  rel?: string;
  children?: SidebarData[];
}

export interface ISidebar extends CPI {
  theme: string;
  collapse: boolean;
  activeKey: number | string;
  expandKeys: string[] | number[];
  accordion: boolean;
  itemKey: string;
  title: string;
  tooltipProps?: object;

  data: SidebarData;
}

declare const Sidebar: ISidebar
export default Sidebar
