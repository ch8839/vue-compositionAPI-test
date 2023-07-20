<template>
  <div class="demo-full-width">
    <div class="type-and-use-size">
      <p>本地搜索</p>
      <mtd-select
        v-model="value"
        class="select-width"
        :filterable="true"
        auto-clear-query
      >
      <mtd-option
          v-for="(item, index) in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.disabled"
        />
      </mtd-select>
    </div>
    <div class="type-and-use-size">
      <p>异步搜索</p>
      <mtd-select
        v-model="value2"
        class="select-width"
        :filterable="true"
        multiple
        :loading="loading"
        
        :remote="true"
        :remote-method="remoteMethod"
      >
        <mtd-option
          v-for="(item, index) in options2"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.disabled"
        />
      </mtd-select>
    </div>
  </div>
</template>
<script>
import bigData from './user.json'
export default {
  data() {
    const options = [
      {
        value: "libai",
        label: "李白",
      },
      {
        value: "lihe",
        label: "李贺",
      },
      {
        value: "dufu",
        label: "杜甫",
        disabled: true,
      },
      {
        value: "baijuyi",
        label: "白居易",
      },
      {
        value: "quyuan",
        label: "屈原",
      },
    ]
    const options2 = [
      {
        value: "libai",
        label: "李白",
      },
      {
        value: "lihe",
        label: "李贺",
      },
      {
        value: "dufu",
        label: "杜甫",
        disabled: true,
      },
      {
        value: "baijuyi",
        label: "白居易",
      },
      {
        value: "quyuan",
        label: "屈原",
      },
    ]
    return {
      options: options,
      options2: options2,
      value: "",
      value2: undefined,
      loading: false,
      bigData: bigData.data,
      show:true,
    }
  },
  methods: {
    remoteMethod(query) {
      clearTimeout(this.remoteTimer)
      this.loading = false
      if (query) {
        this.loading = true
        this.remoteTimer = setTimeout(() => {
          this.options2 = this.options.filter((item) => {
            return (
              item.label.toLowerCase().indexOf(query && query.toLowerCase()) >
              -1
            )
          })
          this.loading = false
        }, 2000)
      } else {
        this.options2 = this.options
      }
    },
    add(){
      this.show = !this.show
      this.options.shift()
    },
    sort(){
      this.show = !this.show
      this.options.reverse()
    },
  },
}
</script>
<style lang="scss">
.type-and-use-size p {
  font-size: 14px;
  color: #464646;
  letter-spacing: 0;
}
.type-and-use-size {
  margin: 0 20px;
  display: inline-block;
  width: 25%;
  text-align: left;
  vertical-align: top;
}
</style>
