import type { paths } from './generated/openapi/shop'

type RequiredKeys<T> = {
  [K in keyof T]-?: object extends Pick<T, K> ? never : K
}[keyof T]

export type PATH = keyof paths
export type METHOD<P extends PATH> = Uppercase<string & RequiredKeys<Omit<paths[P], 'parameters'>>>
