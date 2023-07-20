export {}
declare global {
  interface Window {
    webkitRequestAnimationFrame: (callback: FrameRequestCallback) => number;
  }
}