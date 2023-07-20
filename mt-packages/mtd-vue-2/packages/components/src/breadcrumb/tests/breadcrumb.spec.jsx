import Breadcrumb from '@components/breadcrumb'
import BreadcrumbItem from '@components/breadcrumb-item'
import { createDemoTest, mount, waitImmediate } from '@tests/utils';

describe('Breadcrumb', function () {
  createDemoTest('breadcrumb')
  it('动态切换 separator', async function () {
    const wrapper = mount({
      data () {
        return {
          separator: '>'
        }
      },
      render() {
        return <Breadcrumb separator={this.separator}>
          <BreadcrumbItem>首页</BreadcrumbItem>
          <BreadcrumbItem>列表页</BreadcrumbItem>
          <BreadcrumbItem>详情页</BreadcrumbItem>
        </Breadcrumb>
      }
    })
    expect(wrapper.find('.mtd-breadcrumb-separator').text()).toBe('>')
    await wrapper.setData({ separator: '/' })
    expect(wrapper.find('.mtd-breadcrumb-separator').text()).toBe('/')
    expect(wrapper.html()).toMatchSnapshot()
  })
})
