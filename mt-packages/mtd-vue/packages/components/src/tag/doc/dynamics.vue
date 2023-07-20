<template>
  <div class="demo-tags-compact-groups">
    <mtd-tag
      v-for="(item, i) in tags"
      :key="i"
      closable
      @close="removeTag(i)">
      {{ item }}
    </mtd-tag>
    <mtd-button
      class="button-new-tag"
      v-show="!edit"
      dashed
      size="small"
      icon="add"
      @click="handleAddClick">新标签</mtd-button>
    <mtd-input
      class="input-new-tag"
      ref="input"
      v-model="input"
      v-show="edit"
      size="small"
      @keyup.enter="addTags"
      @blur="handleBlur" />
  </div>
</template>
<script>
export default {
  data () {
    return {
      tags: ['标签', '标签'],
      input: '',
      edit: false,
    };
  },
  methods: {
    handleAddClick () {
      this.edit = true;
      this.$nextTick(_ => {
        this.$refs.input.focus();
      });
    },
    addTags () {
      if (this.input) {
        this.tags.push(this.input);
        this.input = '';
        this.edit = false;
      }
    },
    removeTag (index) {
      const { tags } = this;
      tags.splice(index, 1);
    },
    handleBlur () {
      if (!this.input) {
        this.edit = false;
      }
    },
  },
};
</script>
<style lang='scss'>
  .input-new-tag{
    width: 78px;
    height: 24px;
    margin-left: 40px;
    .mtd-input{
      border-style: dashed;
    }
  }
  .button-new-tag{
    margin-left: 40px;
    height: 24px;
    >span{
      line-height: 22px;
    }
  }
</style>
