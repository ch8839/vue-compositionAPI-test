<template>
  <div class="demo-picker-group">
    <DatePickerSpinner type="year" />
  </div>
</template>
<script>
import DatePickerSpinner from '../base/spinner.tsx'
export default {
  components:{
    DatePickerSpinner,
  },
  data() {
    return {
      value1: new Date(),
    };
  },
};
</script>
