import querystring from 'node:querystring'

import { Client, type Dispatcher } from 'undici'

import type { paths as PathsAppStoreApi } from './generated/openapi/appstore.ts'
import type { paths as PathsShopApi } from './generated/openapi/shop.ts'
import type {
  AppStoreApiPath,
  AppStoreApiMethod,
  ShopApiPath,
  ShopApiMethod,
} from './types.ts'

export const BASE_URL = 'https://api.shop-pro.jp'

export class ColormeApiClient {
  client: Dispatcher

  accessToken: string | null = null
  tokenType: string | null = null
  scope: string | null = null

  constructor(client: Dispatcher = new Client(BASE_URL)) {
    this.client = client
  }

  private getAuthorizationHeader({ accessToken }: { accessToken?: string | undefined }) {
    return { Authorization: `Bearer ${accessToken ?? this.accessToken ?? ''}` }
  }

  setAccessToken({ accessToken, tokenType, scope }: {
    accessToken?: string
    tokenType?: string
    scope?: string
  }) {
    this.accessToken = accessToken ?? null
    this.tokenType = tokenType ?? null
    this.scope = scope ?? null
  }

  /**
   * カラーミーショップアプリストア API
   */

  /**
   * スクリプトタグの取得
   * @link https://app.shop-pro.jp/open_api#tag/script/operation/getShopScriptTags
   */
  getShopScriptTagsV1() {
    const path: AppStoreApiPath = '/appstore/v1/script_tags.json'
    const method: AppStoreApiMethod<typeof path> = 'GET'
    type Response200Json = PathsAppStoreApi[typeof path][Lowercase<typeof method>]['responses']['200']['schema']

    return async ({ accessToken }: { accessToken?: string }) => {
      const response = await this.client.request({
        path,
        method,
        headers: {
          ...this.getAuthorizationHeader({ accessToken }),
        },
      })

      return response.statusCode === 200
        ? {
            response: {
              rawResponse: response,
              ok: true as const,
              json: () => response.body.json() as Promise<Response200Json>,
            },
          }
        : {
            response: {
              rawResponse: response,
              ok: false as const,
            },
          }
    }
  }

  /**
   * スクリプトタグの作成
   * @link https://app.shop-pro.jp/open_api#tag/script/operation/createShopScriptTag
   */
  createShopScriptTagV1() {
    const path: AppStoreApiPath = '/appstore/v1/script_tags.json'
    const method: AppStoreApiMethod<typeof path> = 'POST'
    // `script_tag/script_tag` がなぜかネストされている。恐らく誤りであるため、ここで取り出して解消する。
    type Body = PathsAppStoreApi[typeof path][Lowercase<typeof method>]['parameters']['body']['script_tag']
    type Response200Json = PathsAppStoreApi[typeof path][Lowercase<typeof method>]['responses']['200']['schema']

    type Parameters = {
      body: Body
    }
    return async ({ accessToken, params: { body } }: { accessToken?: string, params: Parameters }) => {
      const response = await this.client.request({
        path,
        method,
        headers: {
          ...this.getAuthorizationHeader({ accessToken }),
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(body),
      })

      return response.statusCode === 200
        ? {
            response: {
              rawResponse: response,
              ok: true as const,
              json: () => response.body.json() as Promise<Response200Json>,
            },
          }
        : {
            response: {
              rawResponse: response,
              ok: false as const,
            },
          }
    }
  }

  /**
   * スクリプトタグの削除
   * @link https://app.shop-pro.jp/open_api#tag/script/operation/deleteScriptTag
   */
  deleteScriptTagV1() {
    const path: AppStoreApiPath = '/appstore/v1/script_tags/{scriptTagId}.json'
    const method: AppStoreApiMethod<typeof path> = 'DELETE'
    type Path = PathsAppStoreApi[typeof path][Lowercase<typeof method>]['parameters']['path']

    type Parameters = {
      path: Path
    }
    return async ({ accessToken, params }: { accessToken?: string, params: Parameters }) => {
      const response = await this.client.request({
        path: path.replace('{scriptTagId}', String(params.path.scriptTagId)),
        method,
        headers: {
          ...this.getAuthorizationHeader({ accessToken }),
        },
      })

      return response.statusCode === 204
        ? {
            response: {
              rawResponse: response,
              ok: true as const,
              json: () => Promise.resolve(),
            },
          }
        : {
            response: {
              rawResponse: response,
              ok: false as const,
            },
          }
    }
  }

  /**
   * カラーミーショップ API
   */

  /**
   * 認可コードをアクセストークンに交換
   * @link https://developer.shop-pro.jp/docs/colorme-api#section/API/利用手順
   */
  getAccessToken() {
    type Response200Json = {
      access_token: string
      token_type: string
      scope: string
    }

    type Parameters = {
      body: {
        client_id: string
        client_secret: string
        code: string
        grant_type: 'authorization_code'
        redirect_uri: string
      }
    }
    return async ({ params: { body } }: { params: Parameters }) => {
      const response = await this.client.request({
        path: '/oauth/token',
        method: 'POST',
        body: querystring.stringify(body),
      })

      return response.statusCode === 200
        ? {
            response: {
              rawResponse: response,
              ok: true as const,
              json: () => response.body.json() as Promise<Response200Json>,
            },
          }
        : {
            response: {
              rawResponse: response,
              ok: false as const,
            },
          }
    }
  }

  /**
   * ショップ情報の取得
   * @link https://developer.shop-pro.jp/docs/colorme-api#tag/shop/operation/getShop
   */
  getShopV1() {
    const path: ShopApiPath = '/v1/shop'
    const method: ShopApiMethod<typeof path> = 'GET'
    type Response200Json = PathsShopApi[typeof path][Lowercase<typeof method>]['responses']['200']['content']['application/json']

    return async ({ accessToken }: { accessToken?: string }) => {
      const response = await this.client.request({
        path,
        method,
        headers: {
          ...this.getAuthorizationHeader({ accessToken }),
        },
      })

      return response.statusCode === 200
        ? {
            response: {
              rawResponse: response,
              ok: true as const,
              json: () => response.body.json() as Promise<Response200Json>,
            },
          }
        : {
            response: {
              rawResponse: response,
              ok: false as const,
            },
          }
    }
  }

  /**
   * 受注データのリストを取得
   * @link https://developer.shop-pro.jp/docs/colorme-api#tag/sale/operation/getSales
   */
  getSalesV1() {
    const path: ShopApiPath = '/v1/sales'
    const method: ShopApiMethod<typeof path> = 'GET'
    type Response200Json = PathsShopApi[typeof path][Lowercase<typeof method>]['responses']['200']['content']['application/json']

    return async ({ accessToken }: { accessToken?: string }) => {
      const response = await this.client.request({
        path,
        method,
        headers: {
          ...this.getAuthorizationHeader({ accessToken }),
        },
      })

      return response.statusCode === 200
        ? {
            response: {
              rawResponse: response,
              ok: true as const,
              json: () => response.body.json() as Promise<Response200Json>,
            },
          }
        : {
            response: {
              rawResponse: response,
              ok: false as const,
            },
          }
    }
  }

  /**
   * 受注データの取得
   * @link https://developer.shop-pro.jp/docs/colorme-api#tag/sale/operation/getSale
   */
  getSaleV1() {
    const path: ShopApiPath = '/v1/sales/{sale_id}'
    const method: ShopApiMethod<typeof path> = 'GET'
    type Path = PathsShopApi[typeof path][Lowercase<typeof method>]['parameters']['path']
    type Response200Json = PathsShopApi[typeof path][Lowercase<typeof method>]['responses']['200']['content']['application/json']

    type Parameters = {
      path: Path
    }
    return async ({ accessToken, params }: { accessToken?: string, params: Parameters }) => {
      const response = await this.client.request({
        path: path.replace('{sale_id}', String(params.path.sale_id)),
        method,
        headers: {
          ...this.getAuthorizationHeader({ accessToken }),
        },
      })

      return response.statusCode === 200
        ? {
            response: {
              rawResponse: response,
              ok: true as const,
              json: () => response.body.json() as Promise<Response200Json>,
            },
          }
        : {
            response: {
              rawResponse: response,
              ok: false as const,
            },
          }
    }
  }

  /**
   * 商品一覧の取得
   * @link https://developer.shop-pro.jp/docs/colorme-api#tag/product/operation/getProducts
   */
  getProductsV1() {
    const path: ShopApiPath = '/v1/products'
    const method: ShopApiMethod<typeof path> = 'GET'
    type Response200Json = PathsShopApi[typeof path][Lowercase<typeof method>]['responses']['200']['content']['application/json']

    return async ({ accessToken }: { accessToken?: string }) => {
      const response = await this.client.request({
        path,
        method,
        headers: {
          ...this.getAuthorizationHeader({ accessToken }),
        },
      })

      return response.statusCode === 200
        ? {
            response: {
              rawResponse: response,
              ok: true as const,
              json: () => response.body.json() as Promise<Response200Json>,
            },
          }
        : {
            response: {
              rawResponse: response,
              ok: false as const,
            },
          }
    }
  }

  /**
   * ショップクーポンの一覧を取得
   * @link https://developer.shop-pro.jp/docs/colorme-api#tag/shop_coupon/operation/getCoupons
   */
  getCouponsV1() {
    const path: ShopApiPath = '/v1/shop_coupons'
    const method: ShopApiMethod<typeof path> = 'GET'
    type Response200Json = PathsShopApi[typeof path][Lowercase<typeof method>]['responses']['200']['content']['application/json']

    return async ({ accessToken }: { accessToken?: string }) => {
      const response = await this.client.request({
        path,
        method,
        headers: {
          ...this.getAuthorizationHeader({ accessToken }),
        },
      })

      return response.statusCode === 200
        ? {
            response: {
              rawResponse: response,
              ok: true as const,
              json: () => response.body.json() as Promise<Response200Json>,
            },
          }
        : {
            response: {
              rawResponse: response,
              ok: false as const,
            },
          }
    }
  }
}
