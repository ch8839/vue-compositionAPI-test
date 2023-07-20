import { mount } from '@tests/utils'
import DatePicker from '../index'

describe('DatePicker', function () {
  it('create', () => {
    const wrapper = mount(DatePicker)
    expect(wrapper.exists()).toBe(true)
  })
})
