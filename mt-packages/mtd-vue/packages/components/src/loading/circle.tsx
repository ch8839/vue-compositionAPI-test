import { useConfig } from "@components/config-provider"
import { computed, defineComponent, ref } from "@ss/mtd-adapter"

function getArcLength(percent: number, radius: number) {
  return percent * 2 * radius * Math.PI
}

export default defineComponent({
  name: "MtdLoadingCircle",
  inheritAttrs: true,
  props: {
    thickness: {
      type: Number,
      default: 2,
    },
    size: {
      type: Number,
      default: 20,
    },
    color: {
      type: String,
      default: "currentColor",
    },
    disableShrink: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const config = useConfig()
    const prefixMTD = computed(() => config.getPrefix())
    const scalePathTimer = ref<undefined | number>(undefined)
    return {
      scalePathTimer, prefixMTD,
    }
  },
  computed: {
    sizeNumber(): number {
      return this.size
    },
    diameter(): number {
      return getArcLength(1, (this.sizeNumber - this.thickness) / 2)
    },
    radius(): number {
      return (this.sizeNumber - this.thickness) / 2
    },
    center(): number {
      return this.sizeNumber / 2
    },
    style() {
      return {
        width: `${this.sizeNumber}px`,
        height: `${this.sizeNumber}px`,
      }
    },
  },
  watch: {
    disableShrink(n) {
      !n ? this.scalePath(this.$refs.path) : clearTimeout(this.scalePathTimer)
    },
  },
  mounted() {
    const {
      $refs: { path },
      disableShrink,
    } = this
    if (!disableShrink) {
      this.scalePath(path)
    }
  },
  beforeUnmount() {
    clearTimeout(this.scalePathTimer)
  },
  methods: {
    scalePath(path: any, step = 0) {
      const { diameter } = this
      step = step % 3
      switch (step) {
        case 0:
          path.style.transitionDuration = "0ms"
          path.style.strokeDasharray = `3 ${diameter}`
          path.style.strokeDashoffset = "0"
          break
        case 1:
          path.style.transitionDuration = "700ms"
          path.style.strokeDasharray = `${0.7 * diameter} ${diameter}`
          path.style.strokeDashoffset = -0.3 * diameter
          break
        case 2:
          path.style.transitionDuration = "700ms" // 多出100ms用于显示最后一点
          path.style.strokeDasharray = `${0.7 * diameter} ${diameter}`
          path.style.strokeDashoffset = 3 - diameter
          // return
          break
      }
      this.scalePathTimer = setTimeout(
        () => {
          this.scalePath(path, step + 1)
        },
        step ? 700 : 100,
      )
    },
  },
  render() {
    const { style, sizeNumber, center, radius, thickness, color, prefixMTD } = this
    return <svg
      style={style}
      class={`${prefixMTD}-loading-circle`}
      viewBox={`0 0 ${sizeNumber} ${sizeNumber}`}
    >
      <circle
        class=""
        ref="path"
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke-linecap="round"
        stroke-width={thickness}
        stroke={color}
        style="stroke-dasharray: 25px 1000px; stroke-dashoffset: 0px;"
      />
    </svg>
  },
})
