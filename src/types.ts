import type { paths as pathsAppStoreApi } from './generated/openapi/appstore.ts'
import type { paths as pathsShopApi } from './generated/openapi/shop.ts'

type RequiredKeys<T> = {
  [K in keyof T]-?: object extends Pick<T, K> ? never : K
}[keyof T]

export type AppStoreApiPath = keyof pathsAppStoreApi
export type AppStoreApiMethod<P extends AppStoreApiPath> = Uppercase<string & RequiredKeys<Omit<pathsAppStoreApi[P], 'parameters'>>>

export type ShopApiPath = keyof pathsShopApi
export type ShopApiMethod<P extends ShopApiPath> = Uppercase<string & RequiredKeys<Omit<pathsShopApi[P], 'parameters'>>>
