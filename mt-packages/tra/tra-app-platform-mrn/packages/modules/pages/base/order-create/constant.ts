export const VALIDATE_RULES = [
  { name: 'skuId', message: '商品不能为空' },
  { name: 'userMobile', message: '手机号码不能为空' },
  {
    name: 'userMobile',
    message: '手机号码格式错误',
    rule: /^(\+86){0,1}[\s]*1[0-9]{10}$/
  }
]
