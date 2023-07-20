import {
  createDemoTest,
  mount,
  triggerClick,
  waitImmediate,
} from '@tests/utils';
import Checkbox from '../index'

describe('Checkbox', function () {
  createDemoTest('checkbox')

  xit('input event',async function () {
    const spy = jest.fn()
    const wrapper = mount({
      data () {
        return {
          checked: false,
        }
      },
      methods: {
        handleChange: spy,
      },
      render () {
        return <Checkbox checked={this.checked}>xxx</Checkbox>
      }
    })
    const input = wrapper.vm.$el.querySelector('input')
    triggerClick(input)
    await waitImmediate()
    expect(spy).toHaveBeenCalledWith(true)
  })
})
