<template>
  <div class="demo-full-width">
    <p>下拉型</p>
    <mtd-collapse v-model="activeValue2">
      <mtd-collapse-item title="春日" value="1">
<pre>一春略无十日晴，处处浮云将雨行。
野田春水碧于镜，人影渡傍鸥不惊。
桃花嫣然出篱笑，似开未开最有情。
茅茨烟暝客衣湿，破梦午鸡啼一声。</pre>
      </mtd-collapse-item>
      <mtd-collapse-item title="夏日山中" value="2">
      <pre>懒摇白羽扇，裸体青林中。
脱巾挂石壁，露顶洒松风。</pre>
      </mtd-collapse-item>
      <mtd-collapse-item title="秋词" value="3">
<pre>秋词
自古逢秋悲寂寥，我言秋日胜春朝。
晴空一鹤排云上，便引诗情到碧霄。</pre>
      </mtd-collapse-item>
      <mtd-collapse-item value="4">
        <template #title>冬柳</template>
        <pre>
柳汀斜对野人窗，零落衰条傍晓江。
正是霜风飘断处，寒鸥惊起一双双。</pre>
      </mtd-collapse-item>
    </mtd-collapse>
  </div>
</template>
<script>
export default {
  data () {
    return {
      activeValue2: '1',
    }
  },
}
</script>
