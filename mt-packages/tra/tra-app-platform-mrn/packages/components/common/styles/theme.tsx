import React, { useContext } from 'react'
import { StyleSheet } from '@mrn/react-native'
import deepmerge from 'deepmerge'
import defaultTheme from './default'
import {
  // themeCompNameMap,
  compCustomMap,
  CompCustomMapType,
  CompCustom,
  setStylesAll
} from './custom'

const mtdContext = { theme: defaultTheme, compCustomMap }
export type MtdContext = typeof mtdContext

export const ThemeContext = React.createContext(mtdContext)
export type Theme = typeof defaultTheme // & { [key: string]: any }
export type PartialTheme = Partial<Theme>

export interface ThemeProviderProps {
  theme?: PartialTheme
  compCustomMap?: Partial<CompCustomMapType>
  children?: React.ReactNode
}

export const ThemeProvider = (props: ThemeProviderProps) => {
  mtdContext.theme = { ...defaultTheme, ...props.theme }
  setStylesAll(props.compCustomMap)

  return (
    <ThemeContext.Provider value={{ ...mtdContext }}>
      {props.children}
    </ThemeContext.Provider>
  )
}

export interface WithThemeProps<T, S> {
  /** 当前组件的组件名 */
  compName: string
  /** 返回样式对象的函数 */
  themeStyles: (theme: Theme) => T
  /** 业务方调用此组件时传入的styles props */
  styles?: S
  children: (
    // fix: styles[`${size}RawText`]
    styles: T, // & { [key: string]: any }
    theme: Theme
  ) => React.ReactNode
}

/**
 * Component can extends this props
 */
export type WithThemeStyles<T> = {
  /** 定制当前组件的所有层级样式 */
  styles?: Partial<T>
  /** 支持自动化测试 */
  testID?: string
}

export function useTheme<T>(
  compName: string,
  themeStyles: any,
  styles: any
): T {
  const context = useContext(ThemeContext)
  // 根据主题变量替换组件样式对象
  let defaultThemeStyles = themeStyles(context.theme)

  // 获取用户设定的自定义样式对象
  // let compName = themeCompNameMap.get(themeMethod as any) || ''
  const compCustom: CompCustom<any> = context.compCustomMap[compName]

  // console.log('渲染组件：', compName)

  if (compCustom !== undefined) {
    // console.log('自定义渲染组件：', compName)

    // 移除值为undefined的样式字段(因deepmerge会将undefined和null的值都进行覆盖替换，遂利用JSON.parse移除undefined的字段)
    let customStyles = compCustom.styles
    try {
      customStyles = JSON.parse(JSON.stringify(compCustom.styles))
    } catch (ex) {}

    if (compCustom.isReplace === true) {
      defaultThemeStyles = customStyles as T
    } else {
      defaultThemeStyles = deepmerge<T>(
        flatternStyles(defaultThemeStyles),
        flatternStyles(customStyles)
      )
    }
  }

  if (styles) {
    // TODO: check these styles has changed
    // merge styles from user defined
    return deepmerge<T>(
      flatternStyles(defaultThemeStyles),
      flatternStyles(styles)
    )
  }
  return defaultThemeStyles
}

export class WithTheme<T, S> extends React.Component<WithThemeProps<T, S>> {
  static defaultProps = {
    themeStyles: () => {
      //
    }
  }

  getStyles = (context: MtdContext) => {
    const { themeStyles: themeMethod, styles } = this.props
    // 根据主题变量替换组件样式对象
    let defaultThemeStyles = themeMethod(context.theme)

    // 获取用户设定的自定义样式对象
    // let compName = themeCompNameMap.get(themeMethod as any) || ''
    const compName = this.props.compName
    const compCustom: CompCustom<any> = context.compCustomMap[compName]

    // console.log('渲染组件：', compName)

    if (compCustom !== undefined) {
      // console.log('自定义渲染组件：', compName)

      // 移除值为undefined的样式字段(因deepmerge会将undefined和null的值都进行覆盖替换，遂利用JSON.parse移除undefined的字段)
      let customStyles = compCustom.styles
      try {
        customStyles = JSON.parse(JSON.stringify(compCustom.styles))
      } catch (ex) {}

      if (compCustom.isReplace === true) {
        defaultThemeStyles = customStyles as T
      } else {
        defaultThemeStyles = deepmerge<T>(
          flatternStyles(defaultThemeStyles),
          flatternStyles(customStyles)
        )
      }
    }

    if (styles) {
      // TODO: check these styles has changed
      // merge styles from user defined
      return deepmerge<T>(
        flatternStyles(defaultThemeStyles),
        flatternStyles(styles)
      )
    }
    return defaultThemeStyles
  }

  render() {
    return (
      <ThemeContext.Consumer>
        {(context): JSX.Element =>
          this.props.children(
            this.getStyles(context),
            context.theme
          ) as JSX.Element
        }
      </ThemeContext.Consumer>
    )
  }
}

function flatternStyles(source) {
  const destination = {}

  Object.keys(source).forEach(key => {
    if (typeof source[key] === 'number') {
      destination[key] = StyleSheet.flatten(source[key])
    } else {
      destination[key] = source[key]
    }
  })

  return destination
}
