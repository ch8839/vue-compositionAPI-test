let _env = ''

function env(v: string) {
  _env = v
  return _env
}

function noop() { }
function getBody(xhr: XMLHttpRequest) {
  const text = xhr.responseText || xhr.response
  if (!text) {
    return text
  }

  try {
    return JSON.parse(text)
  } catch (e) {
    return text
  }
}
function getHost() {
  return ''
}
function UUID() {
  const s = []
  const hexDigits = '0123456789abcdef'
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1) as any
  }
  s[14] = '4'
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
  // s[8] = s[13] = s[18] = s[23] = "1";

  const uuid = s.join('')
  return uuid
}
const uuid = UUID()

function getUser(options: any) {
  const { onSuccess = noop, onError = noop } = options || {}
  const data = {
    operationName: 'userInfo',
    variables: {},
    query: 'query userInfo { userInfo { email login name id} }',
  }

  const xhr = new XMLHttpRequest()
  xhr.open('post', `${getHost()}/graphql`, true)
  xhr.setRequestHeader('content-type', 'application/json')
  xhr.setRequestHeader('token', uuid)
  xhr.withCredentials = true

  xhr.onerror = function error(e) {
    onError(xhr.status, e)
  }

  xhr.onload = function onload() {
    // todo 可以抽出 isSucess 方法
    if (xhr.status < 200 || xhr.status >= 300) {
      return onError(xhr.status, xhr.responseText || xhr.response)
    }
    return onSuccess(getBody(xhr))
  }

  xhr.send(JSON.stringify(data))
}

export function handleLogout() {
  const localUrl = location.href
  const url = `/redirect?url=${encodeURIComponent(localUrl)}`
  location.href = `${getHost()}/sso/logout?url=${encodeURIComponent(
    url,
  )}&t=${Date.now()}`
}

function SSO(onSuccess: Function, onError?: (e: Error) => void) {
  if (_env === 'production') {
    getUser({
      onSuccess,
      onError(status: number, e: Error) {
        if (status === 401) {
          return handleLogout()
        }
        onError && onError(e)
      },
    })
  } else {
    onSuccess()
  }
}
SSO.env = env

export default SSO
