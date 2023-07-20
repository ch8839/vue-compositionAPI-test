import { IFile, IRFile } from '@components/file/types'
import { AnyTypeFun } from './types'
import { computed, defineComponent, PropType, ref } from '@ss/mtd-adapter'
import ajax from './ajax'
import UploadDragger from './upload-dragger'
import { useConfig } from '@components/config-provider'



export default defineComponent({
  components: {
    UploadDragger,
  },
  props: {
    type: String,
    action: {
      type: String,
      required: true,
    },
    id: String,
    name: {
      type: String,
      default: 'file',
    },
    data: Object,
    headers: Object,
    withCredentials: Boolean,
    multiple: Boolean,
    accept: String,
    onStart: {
      type: Function as PropType<AnyTypeFun>,
      required: true,
    },
    onProgress: {
      type: Function as PropType<AnyTypeFun>,
      required: true,
    },
    onSuccess: {
      type: Function as PropType<AnyTypeFun>,
      required: true,
    },
    onError: {
      type: Function as PropType<AnyTypeFun>,
      required: true,
    },
    beforeUpload: Function as PropType<AnyTypeFun>,
    repeatUpload: Function as PropType<AnyTypeFun>,
    drag: Boolean,
    onPreview: {
      type: Function,
      default: () => { },
    },
    onRemove: {
      type: Function as PropType<AnyTypeFun>,
      default: () => { },
    },
    onRetry: {
      type: Function as PropType<AnyTypeFun>,
      default: () => { },
    },
    fileList: {
      type: Array as PropType<IRFile[]>,
      default: () => {
        return []
      },
    },
    autoUpload: Boolean,
    listType: String,
    httpRequest: {
      type: Function as PropType<AnyTypeFun>,
      default: ajax,
    },
    disabled: Boolean,
    limit: Number,
    onExceed: Function as PropType<AnyTypeFun>,
  },
  emits: [],

  setup() {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('upload'))

    const mouseover = ref(false)
    const reqs = ref<any>({})

    return {
      prefix, mouseover, reqs,
    }
  },

  methods: {
    handleChange(ev: InputEvent) {
      const files = (ev.target as HTMLInputElement).files

      if (!files) return
      this.uploadFiles(files!)
    },
    uploadFiles(files: FileList) {
      if (this.limit && this.fileList.length + files.length > this.limit) {
        this.onExceed && this.onExceed(files, this.fileList)
        return
      }

      let postFiles = Array.prototype.slice.call(files)
      if (!this.multiple) {
        postFiles = postFiles.slice(0, 1)
      }

      if (postFiles.length === 0) {
        return
      }

      postFiles.forEach((rawFile) => {
        this.onStart(rawFile)
        if (this.autoUpload) this.upload(rawFile)
      })
    },
    upload(rawFile: IFile) {
      (this.$refs.input as HTMLInputElement).value = ''

      if (!this.beforeUpload) {
        return this.post(rawFile)
      }

      const before = this.beforeUpload(rawFile)
      if (before && before.then) {
        before.then(
          (processedFile: IFile) => {
            const fileType = Object.prototype.toString.call(processedFile)

            if (fileType === '[object File]' || fileType === '[object Blob]') {
              if (fileType === '[object Blob]') {
                processedFile = new File([processedFile], rawFile.name, {
                  type: rawFile.type,
                }) as IFile
              }
              for (const p in rawFile) {
                if (Object.hasOwnProperty.call(rawFile, p)) {
                  (processedFile as any)[p] = (rawFile as any)[p]
                }
              }
              this.post(processedFile)
            } else {
              this.post(rawFile)
            }
          },
          () => {
            this.onRemove(null, rawFile)
          },
        )
      } else if (before !== false) {
        this.post(rawFile)
      } else {
        this.onRemove(null, rawFile)
      }
    },
    abort(file: IFile) {
      const reqs = this.reqs as any
      if (file) {
        if (!file.uid) return
        const uid = file.uid

        if (reqs[uid]) {
          reqs[uid].abort()
        }
      } else {
        Object.keys(reqs).forEach((uid) => {
          if (reqs[uid]) reqs[uid].abort()
          delete reqs[uid]
        })
      }
    },
    post(rawFile: IFile) {
      const { uid } = rawFile
      const options = {
        headers: this.headers,
        withCredentials: this.withCredentials,
        file: rawFile,
        data: this.data,
        filename: this.name,
        action: this.action,
        onProgress: (e: any) => {
          this.onProgress(e, rawFile)
        },
        onSuccess: (res: any) => {
          this.onSuccess(res, rawFile)
          delete this.reqs[uid]
        },
        onError: (err: any) => {
          this.onError(err, rawFile)
          delete this.reqs[uid]
        },
      }
      const req = this.httpRequest(options)
      this.reqs[uid] = req
      if (req && req.then) {
        req.then(options.onSuccess, options.onError)
      }
    },
    handleClick() {
      if (!this.disabled) {
        const input = this.$refs.input as HTMLInputElement
        input.value = ''
        input.click()
      }
    },
    handleKeydown(e: KeyboardEvent) {
      if (e.target !== e.currentTarget) return
      if (e.key === 'enter' || e.key === 'down') {
        this.handleClick()
      }
    },
  },

  render() {
    const {
      prefix,
      id,
      drag,
      name,
      multiple,
      accept,
      listType,
      disabled,
    } = this
    return <div
      class={{
        [prefix]: true,
        [`${prefix}-${listType}`]: true,
      }}
      tabindex={0}
      onClick={this.handleClick}
      onKeydown={this.handleKeydown}
    >
      {drag
        ? <upload-dragger disabled={disabled} onFile={this.uploadFiles}>
          {this.$slots.default}
        </upload-dragger>
        : this.$slots.default
      }
      <input
        class={`${prefix}-input`}
        style="display: none;"
        type="file"
        ref="input"
        id={id}
        name={name}
        onChange={this.handleChange}
        multiple={multiple}
        accept={accept}
      />
    </div>
  },
})
