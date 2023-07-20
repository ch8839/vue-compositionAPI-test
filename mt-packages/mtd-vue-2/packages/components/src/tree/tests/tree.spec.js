import { mount } from '@tests/utils'
import Tree from '../index'

describe('Tree', function () {
  it('create', () => {
    const wrapper = mount(Tree)
    expect(wrapper.exists()).toBe(true)
  })
})
