import { mount } from '@tests/utils'
import TreeNode from '../index'

describe('TreeNode', function () {
  it('create', () => {
    const wrapper = mount(TreeNode)
    expect(wrapper.exists()).toBe(true)
  })
})
