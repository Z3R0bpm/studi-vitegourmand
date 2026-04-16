export default function debounce<T extends (...args: any[]) => any>(
  delayedFunction: T,
  delay: number,
) {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
    clearTimeout(timeout)
    return new Promise((resolve, reject) => {
      timeout = setTimeout(async () => {
        try {
          const result = await delayedFunction(...args)
          resolve(result)
        } catch (error) {
          reject(error)
        }
      }, delay)
    })
  }
}
