import { ServiceRequestConfig } from './factory'

export type Fetch<T = any> = (options: ServiceRequestConfig) => Promise<T>
