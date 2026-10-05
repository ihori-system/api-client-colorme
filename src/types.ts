import type { paths as pathsAppStoreApi } from './generated/openapi/appstore'
import type { paths as pathsShopApi } from './generated/openapi/shop'

type RequiredKeys<T> = {
  [K in keyof T]-?: object extends Pick<T, K> ? never : K
}[keyof T]

export type APPSTORE_API_PATH = keyof pathsAppStoreApi
export type APPSTORE_API_METHOD<P extends APPSTORE_API_PATH> = Uppercase<string & RequiredKeys<Omit<pathsAppStoreApi[P], 'parameters'>>>

export type SHOP_API_PATH = keyof pathsShopApi
export type SHOP_API_METHOD<P extends SHOP_API_PATH> = Uppercase<string & RequiredKeys<Omit<pathsShopApi[P], 'parameters'>>>
