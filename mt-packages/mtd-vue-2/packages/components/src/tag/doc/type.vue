<template>
  <div class="demo-tags-groups">
    <div class="demo-props-option">
      <span>
        <b>是否显示图标：</b>
        <mtd-switch v-model="showIcon"/>
      </span>
      <br>
      <span>
        <b>是否可以删除：</b>
        <mtd-switch v-model="closable"/>
      </span>
      <br>
      <span>
        <b>是否边框圆角：</b>
        <mtd-switch v-model="rounded"/>
      </span>
    </div>
    <br><br>

    <mtd-tag :rounded="rounded" :closable="closable" :prefix-icon="showIcon ? 'mtdicon mtdicon-info-circle-o' : ''">标签(面+线)</mtd-tag>
    <mtd-tag :rounded="rounded" type="pure" :closable="closable" :prefix-icon="showIcon ? 'mtdicon mtdicon-info-circle-o': ''">标签(面型)</mtd-tag>
    <mtd-tag :rounded="rounded" type="ghost" :closable="closable" :prefix-icon="showIcon ? 'mtdicon mtdicon-info-circle-o': ''">标签(线型)</mtd-tag>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      closable: false,
      showIcon: false,
      rounded: false,
    };
  },
  methods: {
  },
};
</script>

