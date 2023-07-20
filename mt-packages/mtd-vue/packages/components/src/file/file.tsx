import {
  defineComponent,
  PropType,
  computed,
  Fragment,
} from '@ss/mtd-adapter'
import useConfig from '@hooks/config'
import { IRFile, MtdFile } from './types'

import MtdProgress from '@components/progress'
import MtdIcon from '@components/icon'
import { isFunction } from '@components/__utils__/type'

export default defineComponent({
  name: 'MtdFile',
  components: {
    Fragment,
    MtdProgress,
    MtdIcon,
  },
  inheritAttrs: true,
  props: {
    file: {
      type: Object as PropType<MtdFile>,
    },
    type: {
      type: String,
      default: 'border-panel',
    }, // text border-panel filled-panel picture-card
    // 缩略图地址
    thumbUrl: {
      type: [String, Function],
    },
  },
  emits: ['keydown', 'focus', 'blur', 'click', 'redo', 'remove', 'download'],
  setup(props, { emit }) {
    const config = useConfig()
    const prefix = computed(() => config.getPrefixCls('file'))

    const retry = () => { emit('retry', props.file) }
    const remove = () => { emit('remove', props.file) }
    const download = () => {
      emit('download', props.file)
      window.open(props.file?.url)
    }
    function compatibleDefaultUrl(file: IRFile) {
      const isImageType = /\.(png|jpg|jpeg|webp|WEBP|GIF|PNG|JPG|JPEG)$/.test(
        file.name,
      )
      if (!isImageType && props.thumbUrl) {
        return isFunction(props.thumbUrl)
          ? props.thumbUrl(props.file)
          : props.file?.thumbUrl
      }
      return file.url || 'http://static.runoob.com/images/demo/demo2.jpg'
    }

    return {
      prefix,
      retry, remove, download, compatibleDefaultUrl,
    }
  },
  render() {
    const {
      prefix, file, type,
    } = this

    const renderFileMsg = () => {
      switch (file?.status) {
        case 'fail':
          return <span class={`${prefix}-msg`}>
            <mtd-icon name="warning-circle-o" />{file.statusMsg || '上传错误'}
          </span>
        case 'success':
          return <span class={`${prefix}-msg`}>
            <span>{`${(file.size / 1024).toFixed(2)}M`}</span>
            <span>{file.user}</span>
            <span>{file.time}</span>
          </span>
        case 'uploading':
          return <mtd-progress percentage={file.percentage} stroke-width={4} show-info={false} />
        default: <span></span>
          break
      }
    }

    const renderHandler = () => {
      switch (file?.status) {
        case 'fail':
          return <fragment>
            <mtd-icon name="refresh-o" onClick={this.retry} />
            <mtd-icon name="delete-o" onClick={this.remove} />
          </fragment>
        case 'success':
          return <fragment>
            <mtd-icon name="download-o" onClick={this.download} />
            <mtd-icon name="delete-o" onClick={this.remove} />
          </fragment>
        case 'uploading':
          return <span>{`${file.percentage}%`}</span>
        default: <span></span>
          break
      }
    }

    const renderPicCard = (file: IRFile) => {
      return file.status !== 'uploading'
        ? <div>
          <img
            class={`${prefix}-thumbnail`}
            v-show={file.status !== 'uploading'}
            src={this.compatibleDefaultUrl(file)}
            alt=""
          />
          <div
            class={`${prefix}-pic-actions`}
            v-show={file.status !== 'uploading'}
          >
            {file.status === 'fail'
              ? <div onClick={this.retry}>
                <mtd-icon name="refresh-o" />
              </div>
              : <div onClick={this.download}>
                <mtd-icon name="download-o" />
              </div>
            }
            <div onClick={this.remove}>
              <mtd-icon name="delete-o" />
            </div>
          </div>
        </div>
        : <div class={`${prefix}-type-picture-card-uploading`}>
          <mtd-progress percentage={file.percentage} stroke-width={4} show-info={false} />
          <span>{`上传中 ${file.percentage || 0}%`}</span>
        </div>
    }

    return <li
      class={{
        [prefix]: true,
        [`${prefix}-${file?.status}`]: file && file.status,
        [`${prefix}-type-panel`]: type === 'border-panel' || type === 'filled-panel',
        [`${prefix}-type-${type}`]: true,
      }}
      v-show={file}
    >

      {type === 'picture-card'
        ? renderPicCard(file!)
        : <fragment>
          <div
            class={`${prefix}-pic`}
            style={{
              backgroundImage: `url(${this.compatibleDefaultUrl(file!)})`,
              height: '46px',
              width: '46px',
            }}
          >
          </div>
          <div class={`${prefix}-content`}>
            <div class={`${prefix}-title`}>{file?.name}</div>
            {renderFileMsg()}
          </div>
          <div class={`${prefix}-icon`}>
            {renderHandler()}
          </div>
        </fragment>
      }

    </li>
  },
})

