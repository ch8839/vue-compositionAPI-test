import Drawer from '@components/drawer'
import {
  createDemoTest,
  mount,
  triggerClick,
  wait,
  waitImmediate,
  asyncExpect,
} from '@tests/utils'

const drawerClass = '.mtd-drawer'

describe('Drawer', function () {
  createDemoTest('drawer')

  // @Slot
  it('title slot', async () => {
    const wrapper = mount(Drawer, {
      propsData: {
        title: 'Drawer Title',
        visible: true,
      },
      slots: {
        title: '<span>Drawer Title Slot Content</span>'
      }
    })
    expect(wrapper.find('.mtd-drawer-header').text()).toEqual('Drawer Title Slot Content')
  });
})
