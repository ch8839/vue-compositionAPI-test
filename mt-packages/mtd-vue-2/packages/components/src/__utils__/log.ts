export function warn(componentName: string, message: string, ...args: any[]) {
  console.warn(`[MTD Warn][Component ${componentName}]: ${message}`, ...args)
}

export function error(componentName: string, message: string, ...args: any[]) {
  console.error(`[MTD Error][Component ${componentName}]: ${message}`, ...args)
}

export function createError (componentName: string, message: string) {
  return new Error(`[MTD Error][Component ${componentName}]: ${message}`)
}
