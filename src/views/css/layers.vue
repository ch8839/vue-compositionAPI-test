<template>
  <div class="css-container">
    <p>
      定位元素 > 浮动元素 z-index默认auto
      当定位元素z-index:auto，生成盒在当前层叠上下文中的层级为 0，
      （1）.背景和边框:建立当前层叠上下文元素的背景和边框。
      （2）.负的z-index:当前层叠上下文中，z-index属性值为负的元素。
      （3）.块级盒:文档流内非行内级非定位后代元素。
      （4）.浮动盒:非定位浮动元素。 （5）.行内盒:文档流内行内级非定位后代元素。
      （6）.z-index:0：层叠级数为0的定位元素。
      （7）.正z-index:z-index属性值为正的定位元素。
    </p>
    <p>
      让一个元素变成层叠上下文元素呢？
      其实，层叠上下文也基本上是有一些特定的CSS属性创建的，一般有3种方法：
      1.HTML中的根元素&lt;html&gt;&lt;/html&gt;
      本身j就具有层叠上下文，称为“根层叠上下文”。
      普通元素设置position属性为非static值并设置z-index属性为具体数值，产生层叠上下文。
      CSS3中的新属性也可以产生层叠上下文
    </p>
    <!-- 父元素的display属性值为flex|inline-flex，子元素z-index属性值不为auto的时候，子元素为层叠上下文元素 -->
    <div class="box">
      <div class="default-box">默认：</div>
      <div class="minus-zindex-box">负z-index</div>
      <span class="inline-box">行内盒一二三四五六七八</span>
      <div class="zero-zindex-box">0 z-index</div>
      <div class="plus-zindex-box">正z-index</div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from '@vue/composition-api'
export default {
  setup() {
    const count = ref(0)

    return {
      count,
    }
  },
}
</script>

<style lang="scss" scoped>
.css-container {
  display: flex;
  flex-direction: column;
}
// 由于父元素为flex,子元素box设置了z-index，所以box为新的层叠上下文元素，此时按照规则背景是最低层级
.box {
  width: 500px;
  height: 500px;
  background: #96c2ff;
  z-index: 99999;
  .default-box {
    width: 300px;
    height: 300px;
    background: #ffeb94;
    margin-left: 100px;
    margin-top: 100px;
  }
  .minus-zindex-box {
    position: absolute;
    top: 50px;
    left: 50px;
    z-index: -100;
    width: 300px;
    height: 300px;
    background: #eea970;
  }
  .inline-box {
    margin-left: 100px;
    margin-top: 100px;
  }
  .zero-zindex-box {
    position: absolute;
    top: 150px;
    left: 150px;
    z-index: 0;
    width: 300px;
    height: 300px;
    background: #62b947;
  }
  .plus-zindex-box {
    position: absolute;
    top: 200px;
    left: 200px;
    z-index: 0;
    width: 300px;
    height: 300px;
    background: #47b9a0;
  }

}
</style>
