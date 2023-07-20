// WIKI: https://km.sankuai.com/page/118802376
export const ORDER_STATUS = {
  INIT: {
    label: '初始状态',
    value: 0
  },
  STOCK_LOCKED: {
    label: '库存锁定',
    value: 1
  },
  ORDER_CANCELLED: {
    label: '已取消',
    value: 2
  },
  STOCK_WAIT_PREPARE: {
    label: '待出库',
    value: 3
  },
  STOCK_PREPARED: {
    label: '已出库',
    value: 4
  },
  STOCK_REACHED: {
    label: '已触达',
    value: 5
  },
  ORDER_FINISHED: {
    label: '交易完成',
    value: 6
  },
  ORDER_FAILED: {
    label: '交易失败”',
    value: 7
  }
}

export const ORDER_SUB_STATUS = {
  INIT: {
    label: '初始状态',
    value: 0
  },
  WAIT_CONFIRM: {
    label: '待商家接单',
    value: 31
  },
  PREPARE_GOODS: {
    label: '商家备货中',
    value: 32
  },
  GOODS_SHIPPING: {
    label: '货物在途',
    value: 41
  },
  BACK_PING: {
    label: '拼场中',
    value: 34
  }
}

export const REFUND_STATUS = {
  REFUND_CANCEL: {
    label: '退款取消',
    value: '0002'
  },
  REFUNDING: {
    label: '退款中',
    value: '0003'
  },
  REFUND_SUCCESS: {
    label: '退款完成',
    value: '0004'
  },
  REFUND_REJECT: {
    label: '拒绝退款',
    value: '0005'
  },
  WAIT_PROCESS: {
    label: '待处理',
    value: '0006'
  }
}

export const COUPON_STATUS = {
  AVAILABLE: {
    label: '可使用',
    value: 0
  },
  CONSUMED: {
    label: '已使用',
    value: 1
  },
  REFUND_SUCCESS: {
    label: '退款完成',
    value: 2
  },
  FREEZED: {
    label: '冻结中',
    value: 3
  },
  SUPER_REFUND: {
    label: '超退成功',
    value: 4
  },
  REVERT_SUCCESS: {
    label: '撤销成功',
    value: 5
  }
}

export const ORDER_ACCEPT_METHOD = {
  AUTO: {
    label: '自动接单',
    value: 1
  },
  MANUAL: {
    label: '手动接单',
    value: 2
  }
}
