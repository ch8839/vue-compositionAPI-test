/* eslint-disable max-len */
/**
 * fork from https://github.com/niksy/throttle-debounce/blob/master/throttle.js
 */
/**
 * Throttle execution of a function. Especially useful for rate limiting
 * execution of handlers on events like resize and scroll.
 *
 * @param  {number}    delay -          A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 * @param  {Function}  callback -       A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
 *                                    to `callback` when the throttled-function is executed.
 * @param  {boolean}   [debounceMode] - If `debounceMode` is true (at begin), schedule `clear` to execute after `delay` ms. If `debounceMode` is false (at end),
 *                                    schedule `callback` to execute after `delay` ms.
 *
 * @returns {Function}  A new, throttled, function.
 */
export function throttle (delay: number, callback: Function, debounceMode: boolean) {
  /*
	 * After wrapper has stopped being called, this timeout ensures that
	 * `callback` is executed at the proper times in `throttle` and `end`
	 * debounce modes.
	 */
  let timeoutID: number | undefined
  let cancelled = false

  // Keep track of the last time `callback` was executed.
  let lastExec = 0

  // Function to clear existing timeout
  function clearExistingTimeout() {
    if (timeoutID) {
      clearTimeout(timeoutID)
    }
  }

  // Function to cancel next exec
  function cancel() {
    clearExistingTimeout()
    cancelled = true
  }

  /*
	 * The `wrapper` function encapsulates all of the throttling / debouncing
	 * functionality and when executed will limit the rate at which `callback`
	 * is executed.
	 */
  function wrapper(this: any, ...arguments_: any[]) {
    const elapsed = Date.now() - lastExec

    if (cancelled) {
      return
    }

    // Execute `callback` and update the `lastExec` timestamp.
    const exec = () => {
      lastExec = Date.now()
      callback.apply(this, arguments_)
    }

    /*
		 * If `debounceMode` is true (at begin) this is used to clear the flag
		 * to allow future `callback` executions.
		 */
    function clear() {
      timeoutID = undefined
    }

    if (debounceMode && !timeoutID) {
      /*
			 * Since `wrapper` is being called for the first time and
			 * `debounceMode` is true (at begin), execute `callback`.
			 */
      exec()
    }

    clearExistingTimeout()

    if (debounceMode === undefined && elapsed > delay) {
      /*
			 * In throttle mode, if `delay` time has been exceeded, execute
			 * `callback`.
			 */
      exec()
    } else {
      /*
			 * In trailing throttle mode, since `delay` time has not been
			 * exceeded, schedule `callback` to execute `delay` ms after most
			 * recent execution.
			 *
			 * If `debounceMode` is true (at begin), schedule `clear` to execute
			 * after `delay` ms.
			 *
			 * If `debounceMode` is false (at end), schedule `callback` to
			 * execute after `delay` ms.
			 */
      timeoutID = setTimeout(
        debounceMode ? clear : exec,
        debounceMode === undefined ? delay - elapsed : delay,
      )
    }
  }

  wrapper.cancel = cancel

  // Return the wrapper function.
  return wrapper
}

/**
 * Debounce execution of a function. Debouncing, unlike throttling,
 * guarantees that a function is only executed a single time, either at the
 * very beginning of a series of calls, or at the very end.
 *
 * @param  {number}   delay -         A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 * @param  {boolean}  [atBegin] -     Optional, defaults to false. If atBegin is false or unspecified, callback will only be executed `delay` milliseconds
 *                                  after the last debounced-function call. If atBegin is true, callback will be executed only at the first debounced-function call.
 *                                  (After the throttled-function has not been called for `delay` milliseconds, the internal counter is reset).
 * @param  {Function} callback -      A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
 *                                  to `callback` when the debounced-function is executed.
 *
 * @returns {Function} A new, debounced function.
 */
export function debounce (delay: number, callback: Function) {
  return throttle(delay, callback, false)
}
