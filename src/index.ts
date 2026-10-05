import { Client, type Dispatcher } from 'undici'

import type { paths } from './generated/openapi/shop'
import type { PATH, METHOD } from './types'

export const BASE_URL = 'https://api.shop-pro.jp'

export class ColormeApiClient {
  client: Dispatcher

  constructor(client: Dispatcher = new Client(BASE_URL)) {
    this.client = client
  }

  /**
   * 認可コードをアクセストークンに交換
   * @link https://developer.shop-pro.jp/docs/colorme-api#section/API/利用手順
   */
  async getAccessToken(params: {
    clientId: string
    clientSecret: string
    code: string
    redirectUri: string
  }) {
    type Response200 = Omit<Dispatcher.ResponseData, 'body' | 'statusCode'>
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

    const isSuccess = (response: Dispatcher.ResponseData): response is Response200 => {
      return response.statusCode === 200
    }

    const body = new FormData()
    body.append('client_id', params.clientId)
    body.append('client_secret', params.clientSecret)
    body.append('code', params.code)
    body.append('grant_type', 'authorization_code')
    body.append('redirect_uri', params.redirectUri)

    return await (async () => {
      const response = await this.client.request({
        path: '/oauth/token',
        method: 'POST',
      })

      return {
        response,
        isSuccess,
      }
    })()
  }

  /**
   * ショップ情報の取得
   * @link https://developer.shop-pro.jp/docs/colorme-api#tag/shop/operation/getShop
   */
  async getShopV1() {
    const path: PATH = '/v1/shop'
    const method: METHOD<typeof path> = 'GET'
    type Response200Json = paths[typeof path][Lowercase<typeof method>]['responses'][200]['content']['application/json']
    type Response200 = Omit<Dispatcher.ResponseData, 'body' | 'statusCode'>
      & {
        statusCode: 200
        body: Omit<Dispatcher.ResponseData['body'], 'json'>
      }
      & {
        body: {
          json: () => Promise<Response200Json>
        }
      }

    const isSuccess = (response: Dispatcher.ResponseData): response is Response200 => {
      return response.statusCode === 200
    }

    return await (async () => {
      const response = await this.client.request({
        path,
        method,
      })

      return {
        response,
        isSuccess,
      }
    })()
  }
}
