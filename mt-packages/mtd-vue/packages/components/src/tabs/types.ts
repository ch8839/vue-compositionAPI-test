import { CPI } from '@components/types/component'


export type Size = 'small' | 'normal' | 'large';


export interface IPaneDrop extends CPI {
  tabDropInfo: {
    moreTabs: { label: string; value: any; active: boolean }[];
  };
  active: boolean;
  addTabs?: (pane: IPane, tabs?: ITabsIns) => void
}

export interface IPane extends CPI {
  value: any;
  label?: string;
  icon?: string;
  disabled?: boolean;
  active?: boolean;
  closable?: boolean;
  isClosable: boolean;
  tabDropInfo?: any;
}

export interface ITabNav extends CPI {
  repaint?: () => void
  updateNav: () => void
}


export interface ITabBar {
  lineSize: number;
  tabPosition?: string;

  getStyle(): void;
}


export type ITabs = CPI

export type TabsType = 'card' | 'border-card' | 'text'
export type TabPosition = 'top' | 'bottom' | 'left' | 'right'


export interface ITabsIns extends CPI {
  prefix: string,
  closable?: boolean,
  currentValue?: any,
  addClick: (e: Event) => void
  addTabs: (pane: IPane, tabs: ITabsIns) => void
}

declare const Tabs: ITabs
export default Tabs
