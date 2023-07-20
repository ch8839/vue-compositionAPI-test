import { mount } from '@tests/utils';
import Button from '@components/button'
import Icon from '@components/icon'
import { getConfig } from '../config'
import ConfigProvider, { useConfig } from '../index';


describe('ConfigProvider', function () {
  it('未使用 ConfigProvider 时采用默认值', function () {
    const wrapper = mount({
      render () {
        return <Button ref="button">xxx</Button>
      }
    })
    const button = wrapper.findComponent(Button)
    expect(button.exists()).toBe(true)
    expect(button.vm.prefix).toBe(`${getConfig().prefixCls}-btn`)
  })

  it('使用 ConfigProvider 配置', function () {
    const wrapper = mount({
      render () {
        return (
          <ConfigProvider prefixCls="xxx">
            <Button ref="button">xxx</Button>
          </ConfigProvider>
        )
      }
    })
    const button = wrapper.findComponent(Button)
    expect(button.exists()).toBe(true)
    expect(button.vm.prefix).toBe('xxx-btn')
  })

  it('嵌套 ConfigProvider 时，应当使用最接近的选项', function () {
    const wrapper = mount({
      render () {
        return (
          <ConfigProvider prefixCls="xxx">
            <ConfigProvider prefixCls="yyy">
              <Button ref="button">xxx</Button>
            </ConfigProvider>
          </ConfigProvider>
        )
      }
    })
    const button = wrapper.findComponent(Button)
    expect(button.exists()).toBe(true)
    expect(button.vm.prefix).toBe('yyy-btn')
  })

  it('嵌套 ConfigProvider 时，应当合并配置', function () {
    const wrapper = mount({
      setup () {
        const config = useConfig();
        return config
      },
      render () {
        return (
          <ConfigProvider prefixCls="xxx" icon-prefix-cls="xxx-icon">
            <ConfigProvider prefixCls="yyy">
              <Button ref="button">xxx</Button>
              <Icon name="test" />
            </ConfigProvider>
          </ConfigProvider>
        )
      }
    })
    const button = wrapper.findComponent(Button)
    expect(button.classes()).toContain('yyy-btn')

    const icon = wrapper.findComponent(Icon)
    expect(icon.classes()).toContain('xxx-icon-test')
  })
})
