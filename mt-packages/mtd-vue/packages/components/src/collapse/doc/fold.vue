<template>
  <div   class="demo-full-width">
    <mtd-collapse v-model="activeValue7">
      <mtd-collapse-item title="春日" value="1">
        <mtd-collapse v-model="activeValue8">
          <mtd-collapse-item title="春日" value="1">
<pre>
胜日寻芳泗水滨，无边光景一时新。
等闲识得东风面，万紫千红总是春。
</pre>
          </mtd-collapse-item>
          <mtd-collapse-item title="秋词" value="2">
<pre>
自古逢秋悲寂寥，我言秋日胜春朝。
晴空一鹤排云上，便引诗情到碧霄。
</pre>
          </mtd-collapse-item>
        </mtd-collapse>

      </mtd-collapse-item>
      <mtd-collapse-item title="夏日山中" value="2">
    <pre>懒摇白羽扇，裸体青林中。
脱巾挂石壁，露顶洒松风。</pre>
      </mtd-collapse-item>
      <mtd-collapse-item title="秋词" value="3">
    <pre>自古逢秋悲寂寥，我言秋日胜春朝。
晴空一鹤排云上，便引诗情到碧霄。</pre>
      </mtd-collapse-item>
      <mtd-collapse-item value="4">
        <div slot="title">冬柳</div>
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
      activeValue7: '',
      activeValue8: '',
    };
  },
};
</script>
