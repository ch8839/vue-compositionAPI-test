<template>
  <mtd-form>
    <mtd-form-item label="文案1">
      <mtd-input type="text" v-model="text" />
    </mtd-form-item>
    <mtd-form-item label="文案2">
      <mtd-select type="text" v-model="fields.value">
        <mtd-option :value="1" label="option1" />
        <mtd-option :value="2" label="option2" />
        <mtd-option :value="3" label="option3" />
        <mtd-option :value="4" label="option4" />
      </mtd-select>
    </mtd-form-item>
  </mtd-form>
</template>

<script>
export default {
  data () {
    return {
      text: '',
      fields: {
        value: '',
      },
    };
  },
};
</script>
