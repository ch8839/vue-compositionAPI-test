import {
  defineComponent,
  computed,
  ref,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import useProvide from './useProvide'

export default defineComponent({
  name: 'MtdUploadDrag',
  props: {
    disabled: Boolean,
  },
  emits: ['file'],
  setup(props, { emit }) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('upload-dragger'))

    const dragover = ref(false)
    const uploader = useProvide().injectUploader()

    // use drop
    function onDragover(e: DragEvent) {
      e.preventDefault()
      if (!props.disabled) {
        dragover.value = true
      }
    }
    function onDrop(e: DragEvent) {
      e.preventDefault()
      if (props.disabled || !uploader) return
      const accept = uploader.accept
      dragover.value = false
      if (!accept) {
        emit('file', e.dataTransfer!.files)
        return
      }
      emit(
        'file',
        [].slice.call(e.dataTransfer!.files).filter((file: File) => {
          const { type, name } = file
          const extension =
            name.indexOf('.') > -1 ? `.${name.split('.').pop()}` : ''
          const baseType = type.replace(/\/.*$/, '')
          return accept
            .split(',')
            .map((type) => type.trim())
            .filter((type) => type)
            .some((acceptedType) => {
              if (/\..+$/.test(acceptedType)) {
                return extension === acceptedType
              }
              if (/\/\*$/.test(acceptedType)) {
                return baseType === acceptedType.replace(/\/\*$/, '')
              }
              if (/^[^/]+\/[^/]+$/.test(acceptedType)) {
                return type === acceptedType
              }
              return false
            })
        }),
      )
    }
    function onDragLeave(e: DragEvent) {
      e.preventDefault()
      dragover.value = false
    }
    return {
      prefix, onDragover, onDrop, onDragLeave,
    }
  },
  render() {
    const {
      prefix, dragover,
    } = this
    return <div
      class={{
        [prefix]: true,
        'is-dragover': dragover,
      }}
      onDrop={this.onDrop}
      onDragover={this.onDragover}
      onDragleave={this.onDragLeave}
    >
      {this.$slots.default}
    </div>
  },
})
