import { Client, type Dispatcher } from 'undici'

import type { paths as pathsAppStoreApi } from './generated/openapi/appstore'
import type { paths as pathsShopApi } from './generated/openapi/shop'
import type {
  // AppStore API
  APPSTORE_API_PATH,
  APPSTORE_API_METHOD,

  // Shop API
  SHOP_API_PATH,
  SHOP_API_METHOD,
} from './types'

const BASE_URL = 'https://api.shop-pro.jp'

export class ColormeApiClient {
  client: Dispatcher

  constructor(client: Dispatcher = new Client(BASE_URL)) {
    this.client = client
  }

  /**
   * スクリプトタグの取得
   * @link https://app.shop-pro.jp/open_api#tag/script/operation/getShopScriptTags
   */
  getShopScriptTagsV1() {
    const path: APPSTORE_API_PATH = '/appstore/v1/script_tags.json'
    const method: APPSTORE_API_METHOD<typeof path> = 'GET'
    type Response200Json = pathsAppStoreApi[typeof path][Lowercase<typeof method>]['responses']['200']['schema']
    type ResponseSuccess = Omit<Dispatcher.ResponseData, 'body' | 'statusCode'>
      & {
        statusCode: 200
        body: Omit<Dispatcher.ResponseData['body'], 'json'>
      }
      & {
        body: {
          json: () => Promise<Response200Json>
        }
      }

    const isSuccess = (response: Dispatcher.ResponseData): response is ResponseSuccess => {
      return response.statusCode === 200
    }

    return async () => {
      const response = await this.client.request({
        path,
        method,
      })

      return {
        response,
        isSuccess,
      }
    }
  }

  /**
   * スクリプトタグの作成
   * @link https://app.shop-pro.jp/open_api#tag/script/operation/createShopScriptTag
   */
  createShopScriptTagV1() {
    const path: APPSTORE_API_PATH = '/appstore/v1/script_tags.json'
    const method: APPSTORE_API_METHOD<typeof path> = 'POST'
    // `script_tag/script_tag` がなぜかネストされている。恐らく誤りであるため、ここで取り出して解消する。
    type Body = pathsAppStoreApi[typeof path][Lowercase<typeof method>]['parameters']['body']['script_tag']
    type Response200Json = pathsAppStoreApi[typeof path][Lowercase<typeof method>]['responses']['200']['schema']
    type ResponseSuccess = Omit<Dispatcher.ResponseData, 'body' | 'statusCode'>
      & {
        statusCode: 200
        body: Omit<Dispatcher.ResponseData['body'], 'json'>
      }
      & {
        body: {
          json: () => Promise<Response200Json>
        }
      }

    const isSuccess = (response: Dispatcher.ResponseData): response is ResponseSuccess => {
      return response.statusCode === 200
    }

    interface Parameters {
      body: Body
    }
    return async ({ params: { body } }: { params: Parameters }) => {
      const response = await this.client.request({
        path,
        method,
        body,
      })

      return {
        response,
        isSuccess,
      }
    }
  }

  /**
   * スクリプトタグの削除
   * @link https://app.shop-pro.jp/open_api#tag/script/operation/deleteScriptTag
   */
  deleteScriptTagV1() {
    const path: APPSTORE_API_PATH = '/appstore/v1/script_tags/{scriptTagId}.json'
    const method: APPSTORE_API_METHOD<typeof path> = 'DELETE'
    type Path = pathsAppStoreApi[typeof path][Lowercase<typeof method>]['parameters']['path']
    type ResponseSuccess = Omit<Dispatcher.ResponseData, 'body' | 'statusCode'>
      & {
        statusCode: 204
        body: Omit<Dispatcher.ResponseData['body'], 'json'>
      }
      & {
        body: {
          // No Content
          json: never
        }
      }

    const isSuccess = (response: Dispatcher.ResponseData): response is ResponseSuccess => {
      return response.statusCode === 204
    }

    interface Parameters {
      path: Path
    }
    return async ({ params }: { params: Parameters }) => {
      const response = await this.client.request({
        path: path.replace('{scriptTagId}', String(params.path.scriptTagId)),
        method,
      })

      return {
        response,
        isSuccess,
      }
    }
  }

  /**
   * 認可コードをアクセストークンに交換
   * @link https://developer.shop-pro.jp/docs/colorme-api#section/API/利用手順
   */
  getAccessToken() {
    type ResponseSuccess = Omit<Dispatcher.ResponseData, 'body' | 'statusCode'>
      & {
        statusCode: 200
        body: Omit<Dispatcher.ResponseData['body'], 'json'>
      }
      & {
        body: {
          json: () => Promise<{
            access_token: string
            token_type: string
            scope: string
          }>
        }
      }

    const isSuccess = (response: Dispatcher.ResponseData): response is ResponseSuccess => {
      return response.statusCode === 200
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
      })

      return {
        response,
        isSuccess,
      }
    }
  }

  /**
   * ショップ情報の取得
   * @link https://developer.shop-pro.jp/docs/colorme-api#tag/shop/operation/getShop
   */
  getShopV1() {
    const path: SHOP_API_PATH = '/v1/shop'
    const method: SHOP_API_METHOD<typeof path> = 'GET'
    type Response200Json = pathsShopApi[typeof path][Lowercase<typeof method>]['responses']['200']['content']['application/json']
    type ResponseSuccess = Omit<Dispatcher.ResponseData, 'body' | 'statusCode'>
      & {
        statusCode: 200
        body: Omit<Dispatcher.ResponseData['body'], 'json'>
      }
      & {
        body: {
          json: () => Promise<Response200Json>
        }
      }

    const isSuccess = (response: Dispatcher.ResponseData): response is ResponseSuccess => {
      return response.statusCode === 200
    }

    return async () => {
      const response = await this.client.request({
        path,
        method,
      })

      return {
        response,
        isSuccess,
      }
    }
  }
}
