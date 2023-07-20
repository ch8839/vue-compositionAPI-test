import Affix from '@components/affix'
import {
  createDemoTest,
  mount,
  triggerClick,
  wait,
  waitImmediate,
} from '@tests/utils'

describe('Affix', function () {
  createDemoTest('affix')
  it('created', function () {
    const wrapper = mount(Affix)
    expect(wrapper.exists()).toBe(true)
  })
})
