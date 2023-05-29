import Tabs from './index'
import TabPane from './base/tab-pane'
import TabNav from './base/tab-nav'
import TabDrop from './base/tab-drop'
import TabBar from './base/tab-bar'

export type Size = 'small' | 'normal' | 'large';


/* export interface ITabDrop extends CPI {
  tabDropInfo: {
    moreTabs: { label: string; value: any; active: boolean }[];
  };
  active: boolean;
  addTabs?: (pane: ITabPane, tabs?: ITabsIns) => void
}

export interface ITabPane extends CPI {
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
 */


export type TabsType = 'card' | 'border-card' | 'text'
export type TabPosition = 'top' | 'bottom' | 'left' | 'right'

export type ITabs = InstanceType<typeof Tabs>
export type ITabPane = InstanceType<typeof TabPane>
export type ITabNav = InstanceType<typeof TabNav>
export type ITabDrop = InstanceType<typeof TabDrop>
export type ITabBar = InstanceType<typeof TabBar>

export const isTabDrop = (ins: any): ins is ITabDrop => {
  return ins && (ins as ITabDrop).IS_TAB_DROP
}

/* export interface ITabsIns extends CPI {
  prefix: string,
  closable?: boolean,
  currentValue?: any,
  addClick: (e: Event) => void
  addTabs: (pane: ITabPane, tabs: ITabsIns) => void
}

declare const Tabs: ITabs
export default Tabs */
