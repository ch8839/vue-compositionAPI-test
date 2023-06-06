import { CORE_FLAG } from './constants'

export default function coreError(error: string): never {
  throw new Error(`[${CORE_FLAG}]: ${error}`)
}
