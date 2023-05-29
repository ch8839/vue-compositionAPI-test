import {
  defineComponent,
  PropType,
  computed,
  ref,
  useListeners,
  TransitionGroup as TransitionGroupComp,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import MtdProgress from '@components/progress'
import MtdFile from '@components/file'
import { IRFile } from '@components/file/types'

export default defineComponent({
  name: 'MtdUploadList',

  components: {
    MtdProgress,
    MtdFile,
  },
  props: {
    files: {
      type: Array as PropType<IRFile[]>,
      default: () => {
        return []
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    handlePreview: Function,
    listType: String,
    showFileDown: {
      type: Boolean,
      default: false,
    },
    // 针对使用照片强格式上传的非图片文件，使用自定义图片占位
    thumbUrl: {
      type: [String, Function],
    },
  },
  emits: ['redo', 'remove', 'download', 'retry'],
  setup(props, { emit }) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('upload-list'))
    const prefixItem = computed(() => config.getPrefixCls('upload-list-item'))

    const focusing = ref(false)

    // @Methods


    const fileListener = useListeners({
      remove: (file: IRFile) => { emit('remove', file) },
      retry: (file: IRFile) => { emit('retry', file) },
      download: (file: IRFile) => { emit('download', file) },
    })

    return {
      prefix, focusing, fileListener, prefixItem,
    }

  },
  render() {
    const {
      prefix, files, listType, disabled, fileListener, thumbUrl,
    } = this
    const TransitionGroup = TransitionGroupComp as any
    return <TransitionGroup
      v-show={files && files.length}
      class={[
        prefix,
        {
          'is-disabled': disabled,
          [`${prefix}-${listType}`]: listType,
        },
      ]}
      name={prefix}
      enter-from-class={`${prefix}` + '-enter'}
      tag="ul"
    >
      {files.map(file => <mtd-file
        file={file}
        {...fileListener}
        style="margin-bottom:8px"
        key={file.uid}
        thumbUrl={thumbUrl}
        type={listType === 'picture-card' ? 'picture-card' : 'border-panel'}
        /* class={{
          [prefixItem]: true,
          [`${prefixItem}-${file.status}`]: file.status,
          'focusing': focusing,
        }} */
        tabindex="0"
      />)}
    </TransitionGroup>
  },
})
