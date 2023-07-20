<template>
  <div class="demo-flex">
    <div>
      <p>步数</p>
      <mtd-input-number v-model="value1" :step="2" />
    </div>
    <div>
      <p>精度</p>
      <mtd-input-number v-model="value2" :precision="2" />
    </div>
    <div>
      <p>单位</p>
      <mtd-input-number v-model="value3"
        :formatter="formatter3" :parser="parser3" /><br><br>
      <mtd-input-number v-model="value4"
        :formatter="formatter4" :parser="parser4" /><br><br>
      <mtd-input-number v-model="value5" style="margin-right:8px"/>  个
    </div>
    <div>
      <p>单位</p>
      <mtd-input-group style="width: 100px;">
        <mtd-input-number v-model="value6" :controls="false" :max="10" :min="1" />
        <template slot="append">间</template>
      </mtd-input-group>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value1: 1,
      value2: 1,
      value3: 0,
      value4: 0,
      value5: 0,
      value6: 0,
    };
  },
  methods: {
    formatter3: num => `¥${num}`,
    parser3: num => num.replace('¥', ''),
    formatter4: num => `${num}%`,
    parser4: num => num.replace('%', ''),
  },
};
</script>
