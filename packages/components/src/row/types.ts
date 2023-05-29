import { Component } from '@components/types/component'

export declare interface IRow extends Component {
  tag: string;
  gutter: number;
  type: string;
  justify: string;
  align: string;
}
export interface RowProvide {
  gutter?: number;
}

export type RowStyle =
  | {
      marginLeft: string;
      marginRight: string;
    }
  | {};


declare const Row: IRow
export default Row
