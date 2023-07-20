import { createDemoTest, mount } from '@tests/utils'
import Badge from '../index'

describe('Badge', function () {
  createDemoTest('badge')
  it('create badge', function () {
    const wrapper = mount({
      render () {
        return <Badge value={12}>系统通知</Badge>
      },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
