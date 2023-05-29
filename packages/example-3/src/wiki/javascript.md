# JavaScript 规范
## Lint
必须跑过 lint，具体参照 .eslintrc.js ，部分规则如下:
- 2 空格缩进，带分号
- 变量及函数以驼峰命名
- 禁用 var 声明
- 优先使用 const 声明
- 组件的属性必须要给类型定义
- 组件以 template - script - style 顺序定义
- 组件内顺序以 name - props -data - computed - watch - methods (具体参照 vue/order-in-components)
- 必须要有 v-key 在 v-for 中
- 数组和对象键值对在多行模式必须带尾逗号，单行模式不能带尾逗号

## 命名
- `script`、`js` 中驼峰命名，文档、模板中以 `-` 连接

- 数组类型以复数形式命名
  `options` 对应为 `array` 类型,
  `option` 对应为 `object` 类型

- 统一命名规则
  - 动态组件统一使用 `tag` 属性来指定生成的标签类型
  - 状态对应属性应该为直接的状态名
    如: loading 状态对应属性名应该为 `loading`
    disabled 状态对应属性名应该为 `disabled`
  - 分子以上组件，内部出现多个组件有相同状态则以 `[组件名][状态名]` 驼峰形式对外暴露
  - 内部组件对外暴露 `class` 属性以 `[组件名]Class` 命名

- 内部组件命名也应该符合命名规范

- 内部组件属性透传命名建议以 `[组件名]Props` 名称命名
  例如: 导航组件使用 `logoProps` 属性对 `logo` 标签进行属性传递

- 内部响应事件函数应该以 `handle[EventName]` 命名, `update` 事件以 `update[PropName]` 命名，如果内部有多个相同的事件名，则以`handle[Element/ComponentName][EventnName]` 命名

- 子组件有更改属性需求时，对外发送 `update:PropName` 事件，并且将新值当做第一个参数
  例如:导航组件中会出现一个下拉菜单的需求，下拉显示与否应该只根据 `visible` 属性值而定，当用户点击菜单时，只对外抛出 `updata:visible` 事件，如果此事件并没有改变 `visible` 的值，则下拉依然不会显示。

- `slot` 命名应该明确表明该 `slot` 对应元素的意义
  例如: `<slot name='loading' />` 表明此插槽用来显示自定义的 `loading` 元素

## 属性、事件
- 样式相关枚举类型属性不做强校验、功能相关强校验

- 样式相关需求优先考虑 `css` 或 `scss` 变量方式，如果 `css`、`scss` 实现不了，则需要在 `js` 实现时添加注释说明原因

- 优先考虑支持 `v-model`、`.sync`
  表单类使用 `v-model`，更改属性时 `.sync`

- 上层组件需要支持内部组件属性透传
  例如: `navbar` 组件内包含 `logo` 元素，如果不对 `logo` 元素进行属性透传，外界将失去对 `logo` 的控制

- 组件作用对应某一个原生标签时，需要使用 `v-bind="$attrs"`
  例如: `mtd-input` 组件是对原生 `input` 组件的封装，内部实现时需要在 `input` 标签上使用 `v-bind="$attrs"`，将非 `mtd-input` 组件中定义的属性传递给原生 `input` 标签

- 组件内部不要出现魔数，如果确实有需求需要使用，必须添加注释，描述清楚数值的作用及来源，如果可能更改(该值可能出现自定义的需求)，则将其作为属性，默认值为当前值

- 组件避免出现不同属性控制相同功能
  例如: 分页组件: 可能会有 `total` (总数)、 `pageCount` (总页码数)、`pageSize` (每页页数)。组件内可根据 `pageCount` 属性生成页码，也可以根据 `1 + Math.ceil(total/pageSize)` 来计算出总页码，此时有 2 组属性可以确定总页码数，由于 `total` 与 `pageSize` 包含其他常用功能，故采用 `total`、`pageSize` 计算来确定总页数

- 组件弱控制，避免使用内部状态，控制权交与使用者
  例如: 导航组件的下拉显示状态，是由使用者控制，虽然内置 `click`、`hover` 触发方式，但是触发时只是对外发送 `update:visible` 事件，并未展示出下拉内容，内容的展示仅仅是根据 `visible` 属性的决定

  - 优先使用计算方式得出当前所需内部属性 (vue 中的 computed)
  例如: `tabs` 组件中，`tab` 组件会有 `active` 的状态，`active` 的状态应该由计算属性得出来，而不是通过 `watch` 来改变内部变量
  ```javascript
  // better
  get active () {
    return tabsValue === this.value
  }
  // not
  watch {
    tabsValue (n) {
      this.active = n === this.value
    }
  }
  ```
  - 避免出现内部属性的使用 (vue 的 data 函数， react 的 state)
  某些场景下依然会有需要内部属性的情况，例如: `InputNumber` 组件中需要当输入错误，失去焦点的时候还原成上一次成功的值。

- 内部事件需要讨论确定是否对外传递
  对外传递可能会带来组件升级上的成本，如果确定之后场景都会保留此事件则可以对外发送
  例如:  `tabs` 组件内有翻页功能，当点击翻页按钮时，按钮会往 `tabs` 组件内发送对应的事件，此事件除了 `tabs` 响应外， `tabs` 组件还需要对外抛出

- 在父子组件通信、属性方法定义时，当不需要方法的返回值时，原则上都应该使用事件的方式

- 组件应该支持常用的原生事件，原生事件第一个参数应该是 `event` 对象
  比如说 `button` 组件组件应该支持 `click` 事件，并且第一个参数是 `event`，对于组件不支持的原生事件，使用 `.native` 描述符

- 原生类型事件，其行为应该同原生事件
  例如: `compositionstart`、`compositionend` 事件，应该表现同原生，不应该对外发送 `change` 类型事件

- `change`、`update` 类型事件第一个参数是 `新值`,第二个参数是 `旧值`

- 事件、方法参数应该避免超过3个，且越常用的参数应该越靠前

- 方法中最后一个参数不应该是 bool 类型，应该将所有 bool 类型参数改为 object
  ```
  // 不推荐:
  function doSomthing (param, replace /* bool */)
  // 推荐:
  function doSomthing (param, { replace /* bool */ })
  ```

- 统一使用 `事件` 方式向父级通信，父级通过更改 `prop` 做出回应，插槽方式除外
  例如: `tabs` 组件内，子组件 `tab` 点击时，需要往父组件抛出 `click` 事件， `tabs` 组件根据事件响应更改 `tab` 的激活属性

## 样式
- template 中不要出现 `id` 属性
- 对内部组件提供 class 支持
- 内部所有样式需要符合命名规范
- 自定义样式需求优先考虑 `css` 覆盖、`scss` 变量覆盖方式实现
- 样式相关计算优先使用 scss 实现
- 对于可变元素使用 slot

## 注释
- `setTimeout`、`nextTick` 等异步方法需要说明原因
- 重要的 `if` 判断添加注释
- 样式相关计算需要添加注释说明原因及场景

## 测试
- 测试应该覆盖所有对外暴露的属性、事件
- 单一测试用例应该做到可变量唯一
- 测试文件名应该功能代码文件名，并且以 `.spec.js` 结尾
- 无法测试的点，请添加一个空的测试用例，并在里面添加注释说明原因

## 其他
- 复杂功能、样式应该单独拆分成小组件
- 原子组件应该满足单一原则
- 避免使用选择器来获取元素
- 避免深层次 `watch`
- 完整的组件应该包含：实现、测试、文档、 `ts` 的 `type` 定义、样式
- 表单类型组件应该包含 `name` 属性，并传递给原生标签
- 避免对全局作用域的影响
- 禁止扩展原生类型
