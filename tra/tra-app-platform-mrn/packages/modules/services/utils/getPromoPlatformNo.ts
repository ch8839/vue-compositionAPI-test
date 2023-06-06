/**
 * @description
 * @export
 * @param {*} platform
 * @param {*} channel
 * @param {*} osname
 * @returns
 */
export default function getPlatformNo(
  platform: string,
  channel: string,
  osname: string
) {
  if (platform == 'wx') {
    if (channel == 'mt') {
      return 50050200
    } else {
      return 50010301
    }
  } else if (platform == 'qq') {
    if (osname == 'ios') {
      return 50020200
    } else if (osname == 'android') {
      return 50020100
    } else {
      if (channel == 'mt') {
        return 50050200
      } else {
        return 50010200
      }
    }
  } else if (platform == 'app') {
    if (channel == 'mt') {
      if (osname == 'ios') {
        return 20050400
      } else if (osname == 'android') {
        return 20050500
      } else {
        return 50050200
      }
    } else if (channel == 'dp') {
      if (osname == 'ios') {
        return 20020400
      } else if (osname == 'android') {
        return 20020500
      } else {
        return 50010200
      }
    } else {
      return 50010200
    }
  } else if (platform == 'dpwxapp') {
    return 70010000
  } else if (platform == 'mtwxapp') {
    return 70050000
  } else {
    if (channel == 'mt') {
      return 50050200
    } else {
      return 50010200
    }
  }
}
