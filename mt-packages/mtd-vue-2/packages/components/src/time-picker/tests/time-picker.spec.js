import { mount } from '@tests/utils'
import TimePicker from '../index'

describe('TimePicker', function () {
  it('create', () => {
    const wrapper = mount(TimePicker)
    expect(wrapper.exists()).toBe(true)
  })
})
