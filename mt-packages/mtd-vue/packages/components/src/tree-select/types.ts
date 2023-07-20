
import { Option } from "@components/option/types"
export interface TreeSelectState {
  inputValue: string;
  expandedValue: any;
  focused: boolean;
  previousQuery: string | null;
  filter: string;
  inputWidth: string;
  valueStrs: Array<string>;
  debouncedQuery: Function | null;
  isOnComposition: boolean;

  option?: Option,
  expandedKeys: string[]
  selectedKeys: string[]
}