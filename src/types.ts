import type { paths as PathsAppStoreApi } from './generated/openapi/appstore.ts'
import type { paths as PathsShopApi } from './generated/openapi/shop.ts'

type RequiredKeys<T> = {
  [K in keyof T]-?: object extends Pick<T, K> ? never : K
}[keyof T]

export type AppStoreApiPath = keyof PathsAppStoreApi
export type AppStoreApiMethod<P extends AppStoreApiPath> = Uppercase<string & RequiredKeys<Omit<PathsAppStoreApi[P], 'parameters'>>>

export type ShopApiPath = keyof PathsShopApi
export type ShopApiMethod<P extends ShopApiPath> = Uppercase<string & RequiredKeys<Omit<PathsShopApi[P], 'parameters'>>>
