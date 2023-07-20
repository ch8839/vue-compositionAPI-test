# CSS 规范
- 命名规范：
  类似 BEM 命名规则使用 [namespace]-[componentName]-[local] 的写法，其中 componentName，local 如果是驼峰的话，也改为使用 - 连接

- **组件内所有 class 命名请遵守，包括内部组件**
- 状态类直接加形容词，不需要 is
  ```sass
  // 不推荐
  .button-is-disable{
  }
  // 推荐
  .button-disabled{
  }
  ```
- 类名应该语义化
  ```sass
  // 不推荐
  .button-50{
  }
  // 推荐
  .button-lg{
  }
  ```
- 尽量少的使用 标签选择器
- 尽可能使用缩写，但是应该注意某些缩写可能引起的问题
  ```
  // 不推荐
  .button{
    padding-bottom: 20px;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 0;

    font-family: palatino, georgia, serif;
    font-size: 100%;
    line-height: 1.6;
  }
  // 推荐
  .button{
    padding: 0 10px 20px;
    font: 100%/1.6 palatino, georgia, serif;
  }
  ```
- color 应该使用小写 16进制，尽可能的使用缩写，可以使用 rgba，但是不能使用 rgb
  ```
  color: #fff;
  color: #c3c3c3;
  ```
- 避免使用 will-change 和 @media，如果 需要使用 @media 则需要将 @media 与相关样式放在一起
  ```
  // 不推荐
  .button{

  }
  @media screen {
    .button{}
  }

  // 推荐
  .button{
    @media screen{

    }
  }
  ```
- 使用公共 reset 消除浏览器差异及默认样式
- 绝对不要使用 important
- font-weight 属性必须使用使用相关变量表示
  大致对应如下:  [参考](https://aotu.io/notes/2016/11/08/css3fontweight/index.html)
  ```
  100 - Thin
  200 - Extra Light (Ultra Light)
  300 - Light
  400 - Regular (Normal、Book、Roman)
  500 - Medium
  600 - Semi Bold (Demi Bold)
  700 - Bold
  800 - Extra Bold (Ultra Bold)
  900 - Black (Heavy)
  ```
  其对应 `sass` 变量如下:
  ```sass
  $font-weight-regular: 400!default;
  $font-weight-medium: 500!default;
  $font-weight-semi-bold: 600!default;
  ```
- 有级联关系的变量应该引用自基础变量
  ```sass
  $control-height: 30px!default;
  $control-lg-height: 40px!default;

  $button-height: $control-height!default;
  $button-lg-height: $control-lg-height!default;

  $input-height: $control-height!default;
  $input-lg-height: $control-lg-height!default;
  ```
- 组件变量中，组件类型应该直接接在组件名后面，程度描述应该在具体属性之前，默认程度则不需要带上程度信息：
  ```sass
  // [componentName]-<type>-<describe>-[css]
  $btn-height: 30px!default;
  $btn-large-height: 40px!default;
  $btn-small-height: 28px!default;

  // primary button
  $btn-primary-color: #fff!default;
  $btn-primary-disabled-color: #eee!default;
  ```
- 全局范围内公共变量（不属于某一个单个组件的变量），程度描述应该在具体属性之后，默认程度则需要带上 normal：
  ```sass
  // [css]-[describe]
  $font-size-normal: 14px!default;
  $font-size-small: 12px!default;
  $font-size-large: 16px!default;
  ```
- `z-index` 需要有相关规范，并且书写在一起，组件对外输出时，需要明确告知 `z-index`
- 不允许使用 margin-top，如果有上边距需求使用 padding
- 具体样式中不允许直接出现具体颜色，颜色应该都是变量
- 不允许出现魔数，数字要么是设计给的变量，要么是计算得出，需要体现出过程
- 枚举类型样式应该使用 mixin 生成
- 同一主题、大小、类型下样式应该在一起
  ```
  // 推荐
  $tabs-small-size: 12px!default;
  $tabs-small-min-width: 56px;

  $tabs-normal-size: 14px!default;
  $tabs-normal-min-width: 66px;

  $tabs-large-size: 16px!default;
  $tabs-large-min-width: 80px;

  // 不推荐
  $tabs-small-size: 12px!default;
  $tabs-normal-size: 14px!default;
  $tabs-large-size: 16px!default;
  $tabs-small-min-width: 56px;
  $tabs-normal-min-width: 66px;
  $tabs-large-min-width: 80px;
  ```
- `box-shadow` 应该整体为变量，而不只是颜色
  ```sass
  // 推荐
  $dropdown-box-shadow: 0 0 4px 0 rgba(27, 51, 115, 0.35)!default;
  // 不推荐
  $dropdown-box-shadow-color: rgba(27, 51, 115, 0.35)!default;
  ```
