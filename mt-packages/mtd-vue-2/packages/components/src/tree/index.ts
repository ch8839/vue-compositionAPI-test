import Tree from './tree'
import { withInstall } from '@utils/with-install'
/*
import createControl from './control'
import makeTreeNode from './make'

const MtdTree = createControl('MtdTree', Tree)

export { makeTreeNode }

// 对外暴露, 已有项目在使用
MtdTree.withControl = createControl
MtdTree.makeTreeNode = makeTreeNode */

export default withInstall(Tree)
