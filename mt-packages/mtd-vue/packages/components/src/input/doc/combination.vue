<template>
  <div style="demo-full-width">
    <div style="display:inline-block; width: 350px;">
      <mtd-input v-model="value16">
        <template slot="prepend">http://</template>
        <template slot="append">.com</template>
      </mtd-input>
    </div>
    <br><br><br>
    <div style="display:inline-block; width: 350px;">
      <mtd-input v-model="value17">
        <template slot="prepend">http://</template>
        <template slot="append">
          <mtd-select v-model="appendValue" style="width:77px;">
            <mtd-option value=".com" label=".com" />
            <mtd-option value=".cn" label=".cn" />
          </mtd-select>
        </template>
      </mtd-input>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value16: '',
      value17: '',
      appendValue: '.com',
    };
  },
};
</script>
