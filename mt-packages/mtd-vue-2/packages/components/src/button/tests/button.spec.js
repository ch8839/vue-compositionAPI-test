import Button from '@components/button'
import {
  createDemoTest,
  mount,
  triggerClick,
  wait,
  waitImmediate,
} from '@tests/utils'

describe('Button', function () {
  createDemoTest('button')

  it('未配置 loading 时如果 @click 返回 promise 则需要进入 loading', async function () {
    const onClick = jest.fn()

    const wrapper = mount({
      methods: {
        handleClick () {
          onClick()
          return new Promise(resolve => {
            setTimeout(() => {
              resolve()
            }, 300)
          })
        },
      },
      render () {
        return <Button onClick={this.handleClick}>xxx</Button>
      },
    })
    const button = wrapper.vm.$el
    triggerClick(button)
    await waitImmediate()
    const btn = wrapper.findComponent(Button)
    expect(onClick).toBeCalledTimes(1)
    expect(btn.vm.innerLoading).toBe(true)
    await wait(300)
    expect(btn.vm.innerLoading).toBe(false)
  })

  it ('disabled', async function () {
    const onClick = jest.fn();

    const wrapper = mount({
      methods: {
        handleClick () {
          onClick()
          return new Promise(resolve => {
            setTimeout(() => {
              resolve()
            }, 300)
          })
        },
      },
      render () {
        return <Button disabled={true} onClick={this.handleClick}>xxx</Button>
      },
    })
    const button = wrapper.vm.$el
    triggerClick(button)
    await waitImmediate()
    expect(onClick).not.toHaveBeenCalled()
  })
})
