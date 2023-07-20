import { mount } from '@tests/utils'
import TreeSelect from '../index'

describe('TreeSelect', function () {
  it('create', () => {
    const wrapper = mount(TreeSelect)
    expect(wrapper.exists()).toBe(true)
  })
})
