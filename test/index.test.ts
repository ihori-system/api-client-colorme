import {
  assert,
  describe,
  expect,
  test,
} from 'vitest'

import { MockAgent } from 'undici'

import {
  ColormeApiClient,
} from '../src/index'

const BASE_URL = 'http://localhost'

describe('getShopScriptTagsV1', async () => {
  test('ok', async () => {
    const mockAgent = new MockAgent({ connections: 1 })
    const mockClient = mockAgent.get(BASE_URL)

    mockClient.intercept({ path: '/appstore/v1/script_tags.json', method: 'GET' }).reply(200, {
      script_tags: [
        {
          id: 1342332,
          account_id: 'PA12345678',
          oauth_application_id: 12,
          src: 'https://example.com/example.js',
          integrity: 'sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC',
          display_scope: 'shop',
          make_date: 1465784944,
          update_date: 1494496809,
        },
      ],
    })

    const client = new ColormeApiClient(mockClient)

    const { response } = await client.getShopScriptTagsV1()({})
    assert(response.ok)

    const json = await response.json()
    assert(json.script_tags !== undefined)
    expect(json.script_tags.length).toBe(1)
    expect(json.script_tags[0].id).toBe(1342332)
  })

  test('not ok', async () => {
    const mockAgent = new MockAgent({ connections: 1 })
    const mockClient = mockAgent.get(BASE_URL)

    mockClient.intercept({ path: '/appstore/v1/script_tags.json', method: 'GET' }).reply(500)

    const client = new ColormeApiClient(mockClient)

    const { response } = await client.getShopScriptTagsV1()({})
    assert(response.ok === false)
  })
})

describe('createShopScriptTagV1', () => {
  test('ok', async () => {
    const mockAgent = new MockAgent({ connections: 1 })
    const mockClient = mockAgent.get(BASE_URL)

    mockClient.intercept({ path: '/appstore/v1/script_tags.json', method: 'POST' }).reply(200, {
      script_tag: {
        id: 1342332,
        account_id: 'PA12345678',
        oauth_application_id: 12,
        src: 'https://example.com/example.js',
        integrity: 'sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC',
        display_scope: 'shop',
        make_date: 1465784944,
        update_date: 1494496809,
      },
    })

    const client = new ColormeApiClient(mockClient)

    const { response } = await client.createShopScriptTagV1()({
      params: {
        body: {
          script_tag: {
            src: 'https://example.com/example.js',
            integrity: 'sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC',
            display_scope: 'shop',
          },
        },

      },
    })
    assert(response.ok)

    const json = await response.json()
    assert(json.script_tag !== undefined)
    expect(json.script_tag.id).toBe(1342332)
  })

  test('not ok', async () => {
    const mockAgent = new MockAgent({ connections: 1 })
    const mockClient = mockAgent.get(BASE_URL)

    mockClient.intercept({ path: '/appstore/v1/script_tags.json', method: 'POST' }).reply(500)

    const client = new ColormeApiClient(mockClient)

    const { response } = await client.createShopScriptTagV1()({
      params: {
        body: {
          script_tag: {
            src: 'https://example.com/example.js',
            integrity: 'sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC',
            display_scope: 'shop',
          },
        },
      },
    })
    assert(response.ok === false)
  })
})

describe('deleteScriptTagV1', () => {
  test('ok', async () => {
    const mockAgent = new MockAgent({ connections: 1 })
    const mockClient = mockAgent.get(BASE_URL)

    mockClient.intercept({ path: '/appstore/v1/script_tags/1342332.json', method: 'DELETE' }).reply(204)

    const client = new ColormeApiClient(mockClient)

    const { response } = await client.deleteScriptTagV1()({ params: { path: { scriptTagId: 1342332 } } })
    assert(response.ok)

    const json = await response.json()
    expect(json).toBe(undefined)
  })

  test('not ok', async () => {
    const mockAgent = new MockAgent({ connections: 1 })
    const mockClient = mockAgent.get(BASE_URL)

    mockClient.intercept({ path: '/appstore/v1/script_tags/1342332.json', method: 'DELETE' }).reply(500)

    const client = new ColormeApiClient(mockClient)

    const { response } = await client.deleteScriptTagV1()({ params: { path: { scriptTagId: 1342332 } } })
    assert(response.ok === false)
  })
})

describe('getAccessToken', () => {
  test('ok', async () => {
    const mockAgent = new MockAgent({ connections: 1 })
    const mockClient = mockAgent.get(BASE_URL)

    mockClient.intercept({ path: '/oauth/token', method: 'POST' }).reply(200, {
      access_token: 'd461ab8XXXXXXXXXXXXXXXXXXXXXXXXX',
      token_type: 'bearer',
      scope: 'read_products write_products',
    })

    const client = new ColormeApiClient(mockClient)

    const { response } = await client.getAccessToken()(
      {
        params: {
          body: {
            client_id: 'CLIENT_ID',
            client_secret: 'CLIENT_SECRET',
            code: 'CODE',
            grant_type: 'authorization_code',
            redirect_uri: 'REDIRECT_URI',
          },
        },
      },
    )
    assert(response.ok)

    const json = await response.json()
    expect(json.access_token).toBe('d461ab8XXXXXXXXXXXXXXXXXXXXXXXXX')

    client.setAccessToken({})

    client.setAccessToken({
      accessToken: json.access_token,
      tokenType: json.token_type,
      scope: json.scope,
    })
  })

  test('not ok', async () => {
    const mockAgent = new MockAgent({ connections: 1 })
    const mockClient = mockAgent.get(BASE_URL)

    mockClient.intercept({ path: '/oauth/token', method: 'POST' }).reply(500)

    const client = new ColormeApiClient(mockClient)

    const { response } = await client.getAccessToken()(
      {
        params: {
          body: {
            client_id: 'CLIENT_ID',
            client_secret: 'CLIENT_SECRET',
            code: 'CODE',
            grant_type: 'authorization_code',
            redirect_uri: 'REDIRECT_URI',
          },
        },
      },
    )
    assert(response.ok === false)
  })
})

describe('getShopV1', () => {
  test('ok', async () => {
    const mockAgent = new MockAgent({ connections: 1 })
    const mockClient = mockAgent.get(BASE_URL)

    mockClient.intercept({ path: '/v1/shop', method: 'GET' }).reply(200,
      {
        shop: {
          id: 'PAXXXXXXXX',
          state: 'enabled',
          domain_plan: 'cmsp_sub_domain',
          contract_plan: 'unknown',
          contract_start_date: 1546268400,
          contract_end_date: 1577718000,
          contract_term: 12,
          last_login_date: 1570750709,
          setup_date: 1511747460,
          make_date: 1511747460,
          url: 'https://example.shop-pro.jp',
          open_state: 'opened',
          mobile_open_state: 'opened',
          login_id: 'testshop',
          name1: '山田',
          name2: '太郎',
          name1_kana: 'ヤマダ',
          name2_kana: 'タロウ',
          hojin: '',
          hojin_kana: '',
          user_mail: 'tarou@example.com',
          tel: '11-1111-1111',
          fax: null,
          postal: '1508512',
          pref_id: 13,
          pref_name: '東京都',
          address1: '渋谷区桜丘町',
          address2: '26-1 セルリアンタワー',
          title: 'テスト商店',
          title_short: 'テスト商店',
          shop_mail_1: 'shop@example.com',
          shop_mail_2: 'shop-phone@example.com',
          tax_type: 'excluded',
          tax: 10,
          tax_rounding_method: 'round_off',
          reduce_tax_rate: 8,
          shop_logo_url: 'https://img00.shop-pro.jp/PA00000/001/PA00000001.png?cmsp_timestamp=20201201214110',
        },
      },
    )

    const client = new ColormeApiClient(mockClient)

    const { response } = await client.getShopV1()({})
    assert(response.ok)

    const json = await response.json()
    assert(json.shop !== undefined)
    expect(json.shop.id).toBe('PAXXXXXXXX')
  })

  test('not ok', async () => {
    const mockAgent = new MockAgent({ connections: 1 })
    const mockClient = mockAgent.get(BASE_URL)

    mockClient.intercept({ path: '/v1/shop', method: 'GET' }).reply(500)

    const client = new ColormeApiClient(mockClient)

    const { response } = await client.getShopV1()({})
    assert(response.ok === false)
  })
})

describe('getProductsV1', () => {
  test('ok', async () => {
    const mockAgent = new MockAgent({ connections: 1 })
    const mockClient = mockAgent.get(BASE_URL)

    mockClient.intercept({ path: '/v1/products', method: 'GET' }).reply(200,
      {
        products: [
          {
            account_id: 'PA01234567',
            id: 1342332,
            name: 'Tシャツ',
            stocks: 20,
            stock_managed: false,
            few_num: 5,
            model_number: 'T-223',
            category: {
              id_big: 13223,
              id_small: 18447,
            },
            group_ids: [
              5456,
              62098,
            ],
            display_state: 'showing',
            sales_price: 1980,
            sales_price_including_tax: 2178,
            sales_price_tax: 198,
            price: null,
            members_price: 1680,
            members_price_including_tax: 1848,
            members_price_tax: 168,
            cost: null,
            delivery_charge: null,
            cool_charge: null,
            unavailable_payment_ids: [
              600001,
              600002,
            ],
            unavailable_delivery_ids: [
              400001,
              400002,
            ],
            min_num: null,
            max_num: null,
            sale_start_date: null,
            sale_end_date: null,
            unit: null,
            weight: null,
            soldout_display: true,
            sort: 2,
            simple_expl: '素材にこだわってつくった、弊社の人気商品です。',
            expl: '綿100%のこだわりTシャツです。\n\n肌触りや吸水性の良さにみなさま驚かれます。弊社の人気商品です。\n',
            mobile_expl: null,
            smartphone_expl: null,
            make_date: 1465784934,
            update_date: 1494496895,
            memo: '',
            image_url: 'https://img07.shop-pro.jp/XXX/XX/product/123.jpg?20130319164314',
            mobile_image_url: 'https://img07.shop-pro.jp/XXX/XX/product/123_mb.jpg?20130319164314',
            thumbnail_image_url: 'https://img07.shop-pro.jp/XXX/XX/product/123_th.jpg?20130319164314',
            images: [
              {
                src: 'string',
                position: 1,
                mobile: true,
              },
            ],
            options: [
              {
                id: 539903,
                product_id: 1342332,
                account_id: 'PA01234567',
                name: '色',
                values: [
                  '赤',
                  '白',
                ],
                make_date: 1465784944,
                update_date: 1494496809,
              },
            ],
            variants: [
              {
                id: 123456,
                product_id: 1342332,
                account_id: 'PA01234567',
                option1_value: '赤',
                option2_value: 'S',
                option1: {
                  id: 1,
                  name: '色',
                  value_id: 1,
                  value: '赤',
                },
                option2: {
                  id: 2,
                  name: 'サイズ',
                  value_id: 1,
                  value: 'S',
                },
                title: '赤　x　S',
                stocks: 20,
                few_num: 5,
                model_number: 'T-RED-S-223',
                weight: 150,
                option_market_price: 300,
                option_cost: 80,
                option_price: 1980,
                option_price_including_tax: 2178,
                option_price_tax: 198,
                option_members_price: 100,
                option_members_price_including_tax: 110,
                option_members_price_tax: 10,
                make_date: 1465784944,
                update_date: 1494496809,
              },
            ],
            pickups: [
              {
                pickup_type: 0,
                order_num: 0,
                make_date: 1465784944,
                update_date: 1494496809,
              },
            ],
            // The OpenAPI specification describes `digital_conent` but it might be typo.
            digital_content: false,
            regular_purchase: false,
            tax_reduced: false,
            without_shipping: false,
          },
        ],
        meta: {
          total: 300,
          limit: 50,
          offset: 200,
        },
      },
    )

    const client = new ColormeApiClient(mockClient)

    const { response } = await client.getProductsV1()({})
    assert(response.ok)

    const json = await response.json()
    assert(json.meta !== undefined)
    assert(json.products !== undefined)

    expect(json.meta.total).toBe(300)
    expect(json.products[0].account_id).toBe('PA01234567')
  })

  test('not ok', async () => {
    const mockAgent = new MockAgent({ connections: 1 })
    const mockClient = mockAgent.get(BASE_URL)

    mockClient.intercept({ path: '/v1/products', method: 'GET' }).reply(500)

    const client = new ColormeApiClient(mockClient)

    const { response } = await client.getProductsV1()({})
    assert(response.ok === false)
  })
})
