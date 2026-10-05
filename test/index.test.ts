import { MockAgent } from 'undici'
import { assert, expect, test } from 'vitest'

import {
  BASE_URL,
  ColormeApiClient,
} from '../src/index'

test('getAccessToken', async () => {
  const mockAgent = new MockAgent({ connections: 1 })
  const mockClient = mockAgent.get(BASE_URL)

  mockClient.intercept({ path: '/oauth/token', method: 'POST' }).reply(200, {
    access_token: 'd461ab8XXXXXXXXXXXXXXXXXXXXXXXXX',
    token_type: 'bearer',
    scope: 'read_products write_products',
  })

  const client = new ColormeApiClient(mockClient)

  const { response, isSuccess } = await client.getAccessToken(
    {
      clientId: 'CLIENT_ID',
      clientSecret: 'CLIENT_SECRET',
      code: 'CODE',
      redirectUri: 'REDIRECT_URI',
    },
  )
  assert(isSuccess(response))

  const json = await response.body.json()
  expect(json.access_token).toBe('d461ab8XXXXXXXXXXXXXXXXXXXXXXXXX')
})

test('getShopV1', async () => {
  const mockAgent = new MockAgent({ connections: 1 })
  const mockClient = mockAgent.get(BASE_URL)

  mockClient.intercept({ path: '/v1/shop', method: 'GET' }).reply(200, {
    shop: {
      id: 'PAXXXXXXXX',
    },
  })

  const client = new ColormeApiClient(mockClient)

  const { response, isSuccess } = await client.getShopV1()
  assert(isSuccess(response))

  const json = await response.body.json()
  expect(json.shop?.id).toBe('PAXXXXXXXX')
})
