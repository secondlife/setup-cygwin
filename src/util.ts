import * as core from '@actions/core'

export async function warnOnError<T = void>(
  fn: () => Promise<T>
): Promise<T | undefined> {
  // Wrap non-critical behavior that can fail during workflow runs in a rather
  // ugly try-catch net.
  try {
    return await fn()
  } catch (error) {
    if (error instanceof Error) {
      core.warning(error.message)
    } else {
      throw error
    }
  }
}
