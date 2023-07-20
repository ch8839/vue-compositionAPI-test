import { ComponentPublicInstance } from '@ss/mtd-adapter'
import { TreeNode as Node, loadData } from '@components/tree/types'

interface TreeNodeInstance<T = any> extends ComponentPublicInstance {
  expandIcon: string;
  node: Node;
  data: T;
  expandOnClickNode: boolean;
  checkOnClickNode: boolean;
  indent: number;
  loadData: loadData;

  nextNode?: Node;
  previousNode?: Node;
}

export interface NodeClassFunction<T = any> {
  (node: Node, data: T): string;
}

export declare type TreeNode = TreeNodeInstance & {
  install(vue: any): void;
  name: string;
};

export default TreeNode
