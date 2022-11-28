export const debounce = <Params extends string[]>(
  func: (...args: Params) => void,
  delay: number
): ((...args: Params) => void) => {
  let timer: ReturnType<typeof setTimeout>
  return function (...args: Params) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func(...args)
    }, delay)
  }
}
