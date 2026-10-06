import { Client, type Dispatcher } from 'undici'

import type { paths as pathsAppStoreApi } from './generated/openapi/appstore.ts'
import type { paths as pathsShopApi } from './generated/openapi/shop.ts'
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
   * スクリプトタグの取得
   * @link https://app.shop-pro.jp/open_api#tag/script/operation/getShopScriptTags
   */
  getShopScriptTagsV1() {
    const path: AppStoreApiPath = '/appstore/v1/script_tags.json'
    const method: AppStoreApiMethod<typeof path> = 'GET'
    type Response200Json = pathsAppStoreApi[typeof path][Lowercase<typeof method>]['responses']['200']['schema']

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
    type Body = pathsAppStoreApi[typeof path][Lowercase<typeof method>]['parameters']['body']['script_tag']
    type Response200Json = pathsAppStoreApi[typeof path][Lowercase<typeof method>]['responses']['200']['schema']

    type Parameters = {
      body: Body
    }
    return async ({ accessToken, params: { body } }: { accessToken?: string, params: Parameters }) => {
      const response = await this.client.request({
        path,
        method,
        headers: {
          ...this.getAuthorizationHeader({ accessToken }),
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
    type Path = pathsAppStoreApi[typeof path][Lowercase<typeof method>]['parameters']['path']

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
   * 認可コードをアクセストークンに交換
   * @link https://developer.shop-pro.jp/docs/colorme-api#section/API/利用手順
   */
  getAccessToken() {
    type Response200Json = {
      access_token: string
      token_type: string
      scope: string
    }

    return async (params: {
      clientId: string
      clientSecret: string
      code: string
      redirectUri: string
    }) => {
      const body = new FormData()
      body.append('client_id', params.clientId)
      body.append('client_secret', params.clientSecret)
      body.append('code', params.code)
      body.append('grant_type', 'authorization_code')
      body.append('redirect_uri', params.redirectUri)

      const response = await this.client.request({
        path: '/oauth/token',
        method: 'POST',
        body,
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
    type Response200Json = pathsShopApi[typeof path][Lowercase<typeof method>]['responses']['200']['content']['application/json']

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
