export {}

interface ILXAnalytics {
  (...args: any[]): void
}

declare global {
  interface Window {
    LXAnalytics: ILXAnalytics
  }
}
