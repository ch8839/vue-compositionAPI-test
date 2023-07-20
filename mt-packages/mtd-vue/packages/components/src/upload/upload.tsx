import {
  defineComponent,
  PropType,
  computed,
  reactive,
  toRefs,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import { IFile, IRFile } from '@components/file/types'
import { AnyTypeFun } from './types'
import useProvide from './useProvide'
import vueInstance from '@components/hooks/instance'

import UploadList from './upload-list'
import UploadDefault from './upload-default'
import MtdProgress from '@components/progress'

function noop() { }

export default defineComponent({
  name: 'MtdUpload',
  components: {
    MtdProgress,
    UploadList,
    UploadDefault,
  },
  inheritAttrs: true,
  props: {
    action: {
      type: String,
      required: true,
    },
    headers: {
      type: Object as PropType<any>,
      default: () => {
        return {}
      },
    },
    data: Object,
    multiple: Boolean,
    name: {
      type: String,
      default: 'file',
    },
    drag: Boolean,
    dragger: Boolean,
    withCredentials: Boolean,
    showFileList: {
      type: Boolean,
      default: true,
    },
    showFileDown: {
      type: Boolean,
      default: false,
    },
    accept: String,
    type: {
      type: String,
      default: 'select',
    },
    beforeUpload: Function as PropType<AnyTypeFun>,
    beforeRemove: Function as PropType<AnyTypeFun>,
    onRemove: {
      type: Function as PropType<AnyTypeFun>,
      default: noop,
    },
    onRetry: {
      type: Function as PropType<AnyTypeFun>,
      default: noop,
    },
    onChange: {
      type: Function as PropType<AnyTypeFun>,
      default: noop,
    },
    onPreview: {
      type: Function as PropType<AnyTypeFun>,
    },
    onSuccess: {
      type: Function as PropType<AnyTypeFun>,
      default: noop,
    },
    onProgress: {
      type: Function as PropType<AnyTypeFun>,
      default: noop,
    },
    onError: {
      type: Function as PropType<AnyTypeFun>,
      default: noop,
    },
    fileList: {
      type: Array,
      default: () => {
        return []
      },
    },
    autoUpload: {
      type: Boolean,
      default: true,
    },
    listType: {
      type: String,
      default: 'text',
    },
    httpRequest: Function as PropType<AnyTypeFun>,
    disabled: Boolean,
    limit: Number,
    onExceed: {
      type: Function as PropType<AnyTypeFun>,
      default: noop,
    },
    elementId: String,
    // 针对使用照片强格式上传的非图片文件，使用自定义图片占位
    thumbUrl: {
      type: [String, Function],
    },
  },
  emits: [],
  setup() {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('upload'))

    const ins = vueInstance()
    useProvide().provideUploader(ins)

    const state = reactive({
      uploadFiles: [] as IRFile[],
      dragOver: false,
      draging: false,
      tempIndex: 1,
    })

    const computedCollection = {

    }
    const methodsCollection = {

    }

    return {
      prefix,
      ...toRefs(state),
      ...computedCollection,
      ...methodsCollection,
    }
  },

  watch: {
    fileList: {
      immediate: true,
      handler(fileList: IRFile[]) {
        this.uploadFiles = fileList.map((item) => {
          item.uid = item.uid || Date.now() + this.tempIndex++
          item.status = item.status || 'success'
          return item
        })
      },
    },
  },

  beforeUnmount() {
    this.uploadFiles.forEach((file) => {
      if (file.url && file.url.indexOf('blob:') === 0) {
        URL.revokeObjectURL(file.url)
      }
    })
  },

  methods: {
    handleStart(rawFile: IFile) {
      rawFile.uid = Date.now() + this.tempIndex++
      const file: IRFile = {
        status: 'ready',
        name: rawFile.name,
        size: rawFile.size,
        percentage: 0,
        uid: rawFile.uid,
        raw: rawFile,
        url: '',
      }
      if (this.listType === 'picture-card' || this.listType === 'text') {
        try {
          file.url = URL.createObjectURL(rawFile)
        } catch (err) {
          console.error('[Mtd Error][Upload]', err)
          return
        }
      }

      this.uploadFiles.push(file)
      this.onChange(file, this.uploadFiles)
    },
    handleProgress(ev: ProgressEvent, rawFile: IFile) {
      const file = this.getFile(rawFile)!
      this.onProgress(ev, file, this.uploadFiles)
      file.status = 'uploading'
      file.percentage = parseInt((ev as any).percent || 0)
    },
    handleSuccess(res: any, rawFile: IFile) {
      const file = this.getFile(rawFile)

      if (file) {
        file.status = 'success'
        file.response = res

        this.onSuccess(res, file, this.uploadFiles)
        this.onChange(file, this.uploadFiles)
      }
    },
    handleError(err: Event, rawFile: IFile) {
      const file = this.getFile(rawFile)!

      file.status = 'fail'

      this.onError(err, file, this.uploadFiles)
      this.onChange(file, this.uploadFiles)
    },
    handleRemove(file: IRFile, raw: IFile) {
      if (raw) {
        file = this.getFile(raw)!
      }
      const doRemove = () => {
        this.abort(file)
        const fileList = this.uploadFiles
        fileList.splice(fileList.indexOf(file), 1)
        this.onRemove(file, fileList)
      }

      if (!this.beforeRemove) {
        doRemove()
      } else if (typeof this.beforeRemove === 'function') {
        const before = this.beforeRemove(file, this.uploadFiles)
        if (before && before.then) {
          before.then(() => {
            doRemove()
          }, noop)
        } else if (before !== false) {
          doRemove()
        }
      }
    },
    handleRetry(file: IRFile) {
      file.status = 'ready'
      this.submit()
    },
    getFile(rawFile: IFile): IRFile | undefined {
      const fileList = this.uploadFiles
      let target: IRFile | undefined
      fileList.every((item) => {
        target = rawFile.uid === item.uid ? item : undefined
        return !target
      })
      return target
    },
    abort(file: IRFile) {
      (this.$refs['upload-inner'] as any).abort(file)
    },
    clearFiles() {
      this.uploadFiles = []
    },
    submit() {
      this.uploadFiles
        .filter((file) => file.status === 'ready')
        .forEach((file) => {
          (this.$refs['upload-inner'] as any).upload(file.raw)
        })
    },
  },

  render() {

    let uploadList

    if (this.showFileList) {
      uploadList = (
        <upload-list
          disabled={this.disabled}
          listType={this.listType}
          files={this.uploadFiles}
          showFileDown={this.showFileDown}
          onRemove={this.handleRemove}
          onRetry={this.handleRetry}
          handlePreview={this.onPreview}
          thumbUrl={this.thumbUrl}
        ></upload-list>
      )
    }

    const uploadData = {
      props: {
        id: this.elementId,
        type: this.type,
        drag: this.drag,
        action: this.action,
        multiple: this.multiple,
        'before-upload': this.beforeUpload,
        'with-credentials': this.withCredentials,
        headers: this.headers,
        name: this.name,
        data: this.data,
        accept: this.accept,
        fileList: this.uploadFiles,
        autoUpload: this.autoUpload,
        listType: this.listType,
        disabled: this.disabled,
        limit: this.limit,

        onExceed: this.onExceed,
        onStart: this.handleStart,
        onProgress: this.handleProgress,
        onSuccess: this.handleSuccess,
        onError: this.handleError,
        onPreview: this.onPreview,
        onRemove: this.handleRemove,
        onRetry: this.handleRetry,
        httpRequest: this.httpRequest,
      },

    }

    const trigger = this.$slots.trigger || this.$slots.default
    const uploadComponent = (
      <upload-default {...uploadData} ref="upload-inner">
        {trigger!}
      </upload-default>
    )

    return (
      <div>
        {this.listType === 'picture-card' ? uploadList : ''}
        {this.$slots.trigger
          ? [uploadComponent, this.$slots.default]
          : uploadComponent
        }
        {this.$slots.tip}
        {this.listType === 'text' ? uploadList : ''}
      </div>
    )
  },
})

