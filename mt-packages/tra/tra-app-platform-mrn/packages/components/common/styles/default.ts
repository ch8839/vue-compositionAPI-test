// 色彩, NOTE: must use `#000000` instead of `#000`
// https://facebook.github.io/react-native/docs/colors.html
// 8-digit-hex to 4-digit hex https://css-tricks.com/8-digit-hex-codes/
// https://www.chromestatus.com/feature/5685348285808640 chrome will support `#RGBA`

// 全局/品牌色
const traColors = {
  // 美团主色
  mtPrimary: '#FFC300',
  // 点评主色
  dpPrimary: '#f63',
  // 老美团主色
  mtOldPrimary: 'rgb(27, 194, 176)',
  // 背景色
  white: '#FFFFFF',
  // 浅灰
  gray: '#f2f2f2',
  // 深灰
  grayDeep: '#e1e1e1',
  // 深深灰
  grayDeeep: '#777',
  // 文案黑色
  black: '#111111',
  // 绿（成功）
  success: '#24BD78',
  // 黄（提醒）
  warning: '#F5BA31',
  // 红（出错/警示）
  danger: '#FF5F57',
  // 蓝 (链接)
  link: '#3D91F2',
  // 线条颜色
  lineColor: 'rgba(0, 0, 0, 0.2)',
  // 按钮按下背景
  opacityColor: 'rgba(0, 0, 0, 0.07)'
}

// 间距
const traSpacing = {
  spacingXs: 4,
  spacingS: 8,
  spacingM: 12,
  spacingL: 15,
  spacingXL: 20,
  spacingXXL: 24
}

const traFontSize = {
  fontSizeXs: 10,
  fontSizeS: 12,
  fontSizeM: 14,
  fontSizeL: 15,
  fontSizeXl: 16,
  fontSizeXll: 17,
  fontSizeXxl: 18,
  fontSizeXxxl: 24,
  fontSizeXxxxl: 36
}

export default {
  /**
   * 公共变量
   */
  ...traColors,
  ...traSpacing,
  ...traFontSize
}
