<template>
  <mtd-row style="width: 100%">
    <mtd-col :span="12">
      <mtd-picker clearable filterable :reserve-keyword="true"
        show-select-all placeholder="请选择" multiple v-model="value">
        <mtd-option value="北京" label="北京">北京</mtd-option>
        <mtd-option value="上海" label="上海">上海</mtd-option>
        <mtd-option value="广州" label="广州">广州</mtd-option>
        <mtd-option value="杭州" label="杭州">杭州</mtd-option>
        <mtd-option value="成都" label="成都">成都</mtd-option>
        <mtd-option value="深圳" label="深圳">深圳</mtd-option>
        <mtd-option value="南京" label="南京">南京</mtd-option>
      </mtd-picker>
    </mtd-col>
    <mtd-col :span="12">
      <mtd-picker clearable filterable :reserve-keyword="true"
        show-select-all placeholder="请选择"
        multiple v-model="value2"
        remote :remote-method="searchCity"
        :loading="loading">
        <mtd-option
          v-for="item in options2"
          :key="item.value"
          :label="item.label"
          :value="item.value" />
      </mtd-picker>
    </mtd-col>
  </mtd-row>
</template>
<script>
export default {
  data () {
    const options = [{
      value: '李白',
      label: '李白',
    }, {
      value: '李贺',
      label: '李贺',
    }, {
      value: '杜甫',
      label: '杜甫',
    }, {
      value: '白居易',
      label: '白居易',
    }, {
      value: '屈原',
      label: '屈原',
    }];
    return {
      value: [],
      value2: [],
      loading: false,
      options: options,
      options2: options,
    };
  },
  methods: {
    searchCity (query) {
      clearTimeout(this.remoteTimer);
      if (query) {
        this.loading = true;
        this.remoteTimer = setTimeout(() => {
          this.options2 = this.options.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query && query.toLowerCase()) > -1;
          });
          this.loading = false;
        }, 2000);
      } else {
        this.options2 = this.options;
        this.loading = false;
      }
    },
  },
};
</script>
